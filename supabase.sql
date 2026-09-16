-- 在 Supabase Dashboard 的 SQL Editor 中执行；用于生产环境的分类、试卷与批改记录。
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);
create table if not exists papers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid references categories(id) on delete set null,
  file_path text not null,
  mime_type text not null,
  status text not null default 'pending' check (status in ('pending','graded')),
  score numeric(5,2),
  comment text,
  annotation_path text,
  created_at timestamptz not null default now(),
  graded_at timestamptz
);
alter table categories enable row level security;
alter table papers enable row level security;
-- 演示环境策略。正式上线接入 Auth 后，请替换为按用户角色限制的策略。
create policy "demo read categories" on categories for select using (true);
create policy "demo write categories" on categories for insert with check (true);
create policy "demo read papers" on papers for select using (true);
create policy "demo write papers" on papers for insert with check (true);
create policy "demo update papers" on papers for update using (true) with check (true);
