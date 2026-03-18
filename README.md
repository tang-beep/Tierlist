# ENGLISH Version Below !
# Application de TierLists

Application web permettant de créer et gérer des **TierLists personnalisées**.

Projet en trois parties conteneurisées :

- Base de données PostgreSQL 16  
- Backend ASP.NET Core (API REST)  
- Frontend React


# Composition du projet

- Une page **Galerie** pour gérer tout le stock d'images et en upload des nouvelles
- Une page de **création de TierList** à partir des images de la Galerie
- Une page de **gestion des TierLists**
- Les pages d'**édition des TierLists** pour classer les images selon vos catégories


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


# ENGLISH Version 

# TierList Application

Web application to create and manage **custom TierLists**.

The project is composed of three containerized parts: 

- PostgreSQL 16 database
- ASP.NET Core backend (REST API)
- React frontend


# Project structure

- A **Gallery page** to manage and upload images
- A **TierList creation** page using gallery images
- A **TierLists management** page
- **TierList editor** pages to organize images into categories


# Run the project

## Requirements
- Docker
- Docker Compose

## Start the application

From the project root: 

```bash
docker compose up --build
```

Once containers are running: 

- Frontend : http://localhost:3000

Stop the application: 

```bash
docker compose down
```

Remove volumes as well (database and images): 

```bash
docker compose down -v
```

# Coming soon

- Home page
- Advanced TierList management (delete, search)
- ...
