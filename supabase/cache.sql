-- maze 공유 API 캐시 테이블
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
--
-- 서버리스 함수는 인스턴스마다 메모리가 분리되고 수시로 재시작되므로,
-- YouTube API 응답처럼 비싼 계산 결과를 여기 저장해 모든 인스턴스가 공유한다.
-- expires_at이 지나도 행을 지우지 않는 이유: YouTube API 할당량 초과 등
-- 상류 장애 시 "오래된 데이터라도" 보여주기 위한 stale 폴백으로 쓰기 때문.

create table if not exists public.api_cache (
  key        text primary key,
  data       jsonb not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.api_cache enable row level security;
