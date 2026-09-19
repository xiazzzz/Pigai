-- 阅卷台（408）试运行版：在 Supabase Dashboard → SQL Editor 中完整执行一次。
-- 当前网页的教师登录仍是演示登录；因此此脚本仅适合试运行，正式招生使用前需接入 Supabase Auth。

create extension if not exists pgcrypto;

create table if not exists public.papers (
  id uuid primary key default gen_random_uuid(),
  student_name text not null check (char_length(student_name) between 1 and 50),
  student_phone text not null check (student_phone ~ '^[0-9]{11}$'),
  file_path text not null,
  file_name text not null,
  mime_type text not null,
  status text not null default 'pending' check (status in ('pending', 'graded')),
  choice_scores jsonb not null default '[]'::jsonb,
  big_scores jsonb not null default '[]'::jsonb,
  score numeric(5,2) not null default 0 check (score between 0 and 150),
  comment text not null default '',
  strokes jsonb not null default '[]'::jsonb,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  graded_at timestamptz
);

-- 兼容已执行过早期脚本的项目：一份试卷可包含多张图片或多个文件。
alter table public.papers add column if not exists file_paths jsonb not null default '[]'::jsonb;

create index if not exists papers_active_created_at_idx on public.papers (created_at desc) where deleted_at is null;
alter table public.papers enable row level security;

-- 仅指定教师 Auth 账号具有读取、批改、恢复与彻底删除权限。
create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path = public
as $$ select coalesce(auth.jwt() ->> 'email', '') = 'teacher@xia.college' $$;

drop policy if exists "trial submit papers" on public.papers;
drop policy if exists "trial read papers" on public.papers;
drop policy if exists "trial update papers" on public.papers;
drop policy if exists "trial delete papers" on public.papers;
drop policy if exists "demo read papers" on public.papers;
drop policy if exists "demo write papers" on public.papers;
drop policy if exists "demo update papers" on public.papers;
drop policy if exists "student submit papers" on public.papers;
drop policy if exists "teacher read papers" on public.papers;
drop policy if exists "teacher update papers" on public.papers;
drop policy if exists "teacher delete papers" on public.papers;
create policy "student submit papers" on public.papers for insert to anon with check (true);
create policy "teacher read papers" on public.papers for select to authenticated using (public.is_teacher());
create policy "teacher update papers" on public.papers for update to authenticated using (public.is_teacher()) with check (public.is_teacher());
create policy "teacher delete papers" on public.papers for delete to authenticated using (public.is_teacher());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('paper-files', 'paper-files', true, 20971520, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 20971520;

drop policy if exists "trial upload paper files" on storage.objects;
drop policy if exists "trial read paper files" on storage.objects;
drop policy if exists "trial delete paper files" on storage.objects;
drop policy if exists "student upload paper files" on storage.objects;
drop policy if exists "teacher read paper files" on storage.objects;
drop policy if exists "teacher delete paper files" on storage.objects;
create policy "student upload paper files" on storage.objects for insert to anon with check (bucket_id = 'paper-files');
create policy "teacher read paper files" on storage.objects for select to authenticated using (bucket_id = 'paper-files' and public.is_teacher());
create policy "teacher delete paper files" on storage.objects for delete to authenticated using (bucket_id = 'paper-files' and public.is_teacher());
