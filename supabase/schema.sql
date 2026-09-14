-- À exécuter une seule fois dans Supabase → SQL Editor.
-- Crée la table utilisée par l'application (accédée via l'API REST Supabase, sans Prisma).

create type "Urgency" as enum ('BASSE', 'MOYENNE', 'HAUTE', 'CRITIQUE');
create type "TaskStatus" as enum ('A_FAIRE', 'EN_COURS', 'TERMINE');

create table "Task" (
  id text primary key,
  "cabCode" text not null,
  "cabLink" text,
  "siteUrl" text not null,
  "siteName" text,
  urgency "Urgency" not null default 'MOYENNE',
  deadline timestamptz,
  status "TaskStatus" not null default 'A_FAIRE',
  "assignedTo" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);

create index "Task_status_idx" on "Task" (status);
create index "Task_urgency_idx" on "Task" (urgency);
create index "Task_assignedTo_idx" on "Task" ("assignedTo");

create table "Dev" (
  id text primary key,
  name text not null unique,
  "createdAt" timestamptz not null default now()
);

-- RLS reste désactivée : la table n'est jamais appelée depuis le navigateur,
-- seulement depuis les server actions Next.js, elles-mêmes protégées par NextAuth.
