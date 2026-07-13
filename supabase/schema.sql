-- maze 게시판 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.

create table if not exists public.posts (
  id           bigint generated always as identity primary key,
  category     text not null default 'info' check (category in ('info', 'suggestion')),
  nickname     text not null check (char_length(nickname) between 1 and 20),
  password_hash text not null,
  title        text not null check (char_length(title) between 1 and 100),
  body         text not null check (char_length(body) between 1 and 5000),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_category_idx on public.posts (category, created_at desc);

-- RLS를 켜되 어떤 public 정책도 두지 않는다.
-- 프론트엔드는 anon 키로 이 테이블에 직접 접근하지 않고, 항상 우리 서버리스
-- 함수(service_role 키)를 거치므로 이 테이블은 외부에서 직접 읽고 쓸 수 없다.
alter table public.posts enable row level security;
