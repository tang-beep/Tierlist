# Application de TierLists

Application web permettant de créer et gérer des **TierLists personnalisées**.

Projet en trois parties contneurisées :

- Base de données PostgreSQL 16  
- Backend ASP.NET Core (API REST)  
- Frontend React


# Composition du projet

- Une page Galerie pour gérer tout le stock d'images et en upload des nouvelles
- Une page de création de TierList à partir des images de la Galerie
- Une page de gestion des TierLists
- Les pages d'édition des TierLists pour classer les images selon vos catégories


# Lancer le projet

## Prérequis
- Docker
- Docker Compose

## Démarrage

À la racine du projet :

```bash
docker compose up --build
```

Une fois les conteneurs démarrés :

- Frontend : http://localhost:3000

Pour arrêter le projet : 

```bash
docker compose down
```

en supprimant les volumes (base de données et images) : 

```bash
docker compose down -v
```

# A venir

- Page d'accueil
- Gestion des TierLists (suppression, recherche)
- ...
