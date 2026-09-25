# Checklist

Application interne de checklist/gestion de tâches (Next.js 14 App Router, NextAuth avec identifiants prédéfinis, Supabase, Tailwind).

## Configuration locale

1. Copier `.env.example` vers `.env` et renseigner les valeurs :
   - `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` : dans le dashboard Supabase → **Settings > API**
   - `SUPABASE_SECRET_KEY` : la clé secrète Supabase, uniquement côté serveur (ne jamais la préfixer par `NEXT_PUBLIC_`)
   - `APP_LOGIN` : l'identifiant partagé de connexion (ex: `equipe`)
   - `APP_PASSWORD` : le mot de passe partagé, en clair
   - `NEXTAUTH_SECRET` : `openssl rand -base64 32`
   - `NEXTAUTH_URL` : `http://localhost:3000` en local

2. Créer la table dans Supabase (une seule fois) : ouvrir le **SQL Editor** du projet Supabase et exécuter le contenu de [`supabase/schema.sql`](supabase/schema.sql).

3. Installer les dépendances puis lancer le serveur de développement :

   ```bash
   npm install
   npm run dev
   ```

L'authentification utilise un seul identifiant/mot de passe partagé par toute l'équipe (pas de comptes individuels). L'accès aux données passe par l'API REST de Supabase (`@supabase/supabase-js`), sans base de données locale ni migrations à gérer.

## Déploiement Vercel

Configurer les mêmes variables d'environnement dans le dashboard Vercel.


