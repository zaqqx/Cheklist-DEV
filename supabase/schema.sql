-- À exécuter une seule fois dans Supabase → SQL Editor.
-- Crée la table utilisée par l'application (accédée via l'API REST Supabase, sans Prisma).

create type "Urgency" as enum ('BASSE', 'MOYENNE', 'HAUTE', 'CRITIQUE');
create type "TaskStatus" as enum ('A_FAIRE', 'EN_COURS', 'TERMINE');

create table "Task" (
  id text primary key,
  "cabCode" text,
  "cabLink" text,
  "siteUrl" text,
  "siteName" text,
  description text,
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

alter table "Task" enable row level security;

create table "Dev" (
  id text primary key,
  name text not null unique,
  "createdAt" timestamptz not null default now()
);

alter table "Dev" enable row level security;

-- Les server actions utilisent SUPABASE_SECRET_KEY côté serveur après vérification NextAuth.
-- Aucune policy publique n'est nécessaire : la clé secrète bypass les RLS.
