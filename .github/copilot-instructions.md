# GitHub Copilot Instructions

## Priorités (ordre strict)

1. Exactitude
2. Sécurité
3. Performance
4. Maintenabilité
5. Simplicité

En cas de compromis, toujours privilégier la priorité la plus haute.

---

## Comportement global

- Solution la plus simple qui répond au besoin — pas d'over-engineering.
- Réutiliser le code existant avant toute nouvelle abstraction.
- Respecter l'architecture et les conventions déjà en place.
- Zéro dépendance externe inutile — privilégier les APIs natives.
- Modifier uniquement ce qui est concerné par la demande.

---

## Génération de code

- Code complet, fonctionnel, directement utilisable en production.
- Jamais de pseudo-code, TODO, FIXME ou placeholders sauf demande explicite.
- Aucune explication ni documentation si non demandée.
- Aucune répétition de la demande.
- Retourner le code en premier, avant tout commentaire.

---

## Performance

- Minimiser les allocations mémoire et les copies inutiles.
- Structures de données adaptées au cas d'usage.
- Réduire la complexité algorithmique quand le gain est mesurable.
- Éviter les optimisations prématurées qui dégradent la lisibilité.
- Préférer les opérations batch aux appels répétitifs.
- Lazy loading systématique si la ressource n'est pas immédiatement nécessaire.

---

## Sécurité

- Valider toutes les entrées utilisateur sans exception.
- Ne jamais exposer de secrets, tokens ou credentials.
- Valeurs par défaut sécurisées (deny by default).
- Échapper les sorties selon le contexte (HTML, SQL, shell...).
- Prévenir : injection SQL, XSS, CSRF, SSRF, path traversal.
- Dépendances : version fixe, pas de `*` ni `latest`.

---

## Architecture

- Responsabilité unique par fonction/module.
- Composition plutôt qu'héritage.
- Interfaces stables, implémentations interchangeables.
- Pas de patterns sans justification concrète.
- Couplage faible, cohésion forte.

---

## Base de données

- Sélectionner uniquement les colonnes nécessaires.
- Éviter les N+1 — eager load quand pertinent.
- Requêtes optimisées pour les index existants.
- Transactions explicites pour les opérations atomiques.
- Pas de requête dynamique non paramétrée.

---

## API

- Réponses minimales — pas de données inutiles.
- Gestion explicite des erreurs avec codes HTTP appropriés.
- Rate limiting et validation côté serveur systématiques.
- Cache sur les endpoints idempotents quand pertinent.
- Idempotence des mutations (PUT/PATCH/DELETE).

---

## Frontend

- Zéro re-render inutile — mémoïsation quand nécessaire.
- État global limité au strict minimum.
- Code splitting et lazy loading par route/composant.
- Bundle size : tree-shaking activé, imports ciblés.
- Pas de logique métier dans les composants UI.

---

## Débogage

- Identifier la cause racine avant de proposer un fix.
- Fix le plus minimal possible.
- Pas d'hypothèses non vérifiées.
- Une seule solution — la meilleure, pas plusieurs spéculatives.

---

## Refactoring

- Réduire la complexité cyclomatique.
- Supprimer le code mort et les duplications.
- Conserver le comportement existant sauf demande contraire.
- Améliorer lisibilité ET performance simultanément.

---

## Format de réponse

- Code d'abord, explication seulement si demandée.
- Modifications ciblées plutôt que réécriture complète.
- Format facilement copiable (blocs de code avec langage spécifié).
- Concis, précis, sans verbiage.

---

## Interdit

- Over-engineering et abstractions non justifiées.
- Dépendances superflues.
- Commentaires évidents ou excessifs.
- Réécriture complète sans nécessité.
- Optimisations sans bénéfice mesurable.
- Réponses verbeuses ou répétitives.
- Code non testé mentalement avant génération.