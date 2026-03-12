SkillForge
Idée de l'application
SkillForge est un réseau social de compétences pour étudiants universitaires, où chaque utilisateur construit un portfolio vivant à travers des projets collaboratifs et des challenges inter-universités.
L'idée centrale : au lieu de mettre son CV sur LinkedIn, tu prouves tes skills en co-créant des projets réels avec d'autres étudiants, et la communauté vote, commente, et valide.
Concept Core
"Show what you can do, not just what you know."
Les étudiants forment des squads (2-5 personnes), lancent des projets collaboratifs sur une durée fixe (1 à 4 semaines), et publient le résultat. D'autres étudiants ou professeurs peuvent endorser les compétences démontrées directement sur le projet.
Fonctionnalités principales
Portfolio dynamique — Chaque projet complété alimente automatiquement le profil. Les skills sont taggés et validés par les co-créateurs.
Squads & co-création — Matching intelligent entre étudiants de compétences complémentaires (un dev + un designer + un marketeur) pour former une équipe sur un challenge.
Challenges universitaires — Les universités ou associations publient des challenges thématiques avec une deadline. Les équipes soumettent, la communauté vote.
Feed de projets — Timeline de projets publiés, filtrables par domaine (tech, design, business, art...), université, ou compétence.
Skill Graph — Visualisation radar de tes compétences évolutives selon les projets réalisés et les endorsements reçus.
Stack Technique
Backend — Spring Boot
Spring Boot 3.x
Spring Security + JWT (auth)
Spring Data JPA + PostgreSQL
Spring WebSocket (collaboration temps réel)
Spring Mail (notifications)
MinIO (stockage fichiers/médias projets)
Frontend — Next.js
Next.js 14 (App Router)
TypeScript
Tailwind CSS + shadcn/ui
Zustand (state management)
Socket.io client (temps réel)
React Query (data fetching)
Infrastructure
Docker + Docker Compose
PostgreSQL
Redis (sessions + cache feed)
Architecture des entités principales
Entité
Attributs clés
User
id, name, university, bio, skillTags[], avatar
Project
id, title, description, squad[], status, tags[], mediaFiles[]
Challenge
id, title, deadline, publisher (uni/asso), theme
Skill
id, name, category, endorsementCount
Squad
id, members[], project, roles
User Journey type
1. Inscription → sélection université + skills initiaux
2. Rejoindre un Challenge ouvert OU créer un projet libre
3. Matcher avec des étudiants complémentaires → former un Squad
4. Co-créer le projet (uploads, descriptions, liens)
5. Publier → la communauté réagit et endorse les skills
6. Portfolio mis à jour automatiquement
Ce qui différencie SkillForge
Pas de CV statique — tout est démontré par le faire
Collaboration inter-universités → réseau plus large
Validation par les pairs et non auto-déclarative
Pensé pour le recrutement étudiant (les entreprises peuvent parcourir les projets)
Ça te parle ? Je peux générer le schéma de base de données complet, la structure des dossiers Spring + Next.js, ou les maquettes des écrans principaux.
