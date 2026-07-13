import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

// Supabase REST(PostgREST) 엔드포인트를 서버에서만 호출한다.
// service_role 키는 RLS를 우회하는 강력한 키이므로 절대 클라이언트로 노출하지 않는다.
// (프론트엔드는 항상 우리 서버리스 함수 api/board.ts를 거친다.)
function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 설정되어 있지 않습니다.',
    );
  }
  // Supabase 대시보드가 "API URL"을 보여줄 때 종종 끝에 /rest/v1/ 까지 붙여서
  // 표시하기도 한다. 어느 형태를 넣어도 동작하도록 프로젝트 기본 URL만 남긴다.
  const baseUrl = url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  return { url: baseUrl, key };
}

/** PostgREST 요청 래퍼. path 예: "/posts?select=id,title&order=created_at.desc" */
export async function sbFetch<T>(
  path: string,
  init: RequestInit & { returnRepresentation?: boolean } = {},
): Promise<T> {
  const { url, key } = supabaseConfig();
  const headers: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.returnRepresentation) headers.Prefer = 'return=representation';

  const res = await fetch(`${url}/rest/v1${path}`, { ...init, headers });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase 오류 (${res.status}): ${body}`);
  }
  // DELETE 등 본문이 없는 응답 대비.
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

// --- 비밀번호 해시 (외부 의존성 없이 Node 내장 scrypt 사용) ---

/** 평문 비밀번호를 "salt:hash"(hex) 형태로 해시한다. */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

/** 저장된 "salt:hash"와 평문 비밀번호가 일치하는지 상수 시간으로 검증한다. */
export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
