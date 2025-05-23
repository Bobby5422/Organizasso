# LU3IN017 : Projet Forum Organiz'asso

## Partie 0 : Github

- **Avant de commencer à coder :**
    ```
    git pull origin main    #mise à jour de la copie locale
    ```

- **Après avoir codé :**
    - Mise à jour
        ```
        git pull origin main    #mise à jour de la copie locale
        ```
    - Enrigstrement des modifications 
        ```
        git add .   #ajout des fichiers modifies
        git commit -m "Message clair sur la modification"
        ```
    - Envoie des modifications 
        ```
        git push origin main
        ```

# Organiz'asso Consignes

Organiz'asso est une application web de forum destinée aux membres d'une association. Le site permet aux utilisateurs d'échanger des messages et d'accéder à diverses fonctionnalités, avec des droits spécifiques pour les administrateurs.

## Objectif du projet

Permettre aux membres d'une association d'échanger des messages via deux types de forums :
- **Forum ouvert** : Accessible à tous les membres inscrits (pour consulter et poster des messages).
- **Forum fermé** : Réservé aux membres du conseil d'administration (administrateurs).

## Fonctionnalités pour les utilisateurs

### Avant connexion
- **Création de compte :**  
  - Un visiteur peut créer un compte pour demander le statut de membre.
  - L'inscription est enregistrée avec un statut "en attente" et doit être validée par un administrateur.

### Une fois connecté (et après validation)
- **Messagerie :**
  - **Création de messages :**  
    - Démarrer une nouvelle discussion.
    - Répondre à un message existant.
  - **Suppression :**  
    - Un membre peut supprimer ses propres messages.
- **Gestion de profil :**
  - Visualiser son profil avec la liste de ses messages publiés.
  - Consulter le profil d’autres membres.
- **Recherche :**
  - Rechercher des messages en filtrant par mots-clés, intervalle de dates ou par auteur.
- **Déconnexion :**
  - Se déconnecter à la fin de la session.

## Fonctionnalités pour les administrateurs

- **Accès au forum fermé :**  
  - Les administrateurs ont accès à un forum réservé.
- **Gestion des utilisateurs :**
  - Valider ou refuser les inscriptions des nouveaux comptes.
  - Attribuer ou retirer le statut administrateur à d'autres utilisateurs (sauf à eux-mêmes).
- **Modération :**
  - Examiner les inscriptions et gérer les messages dans les forums.

## Architecture du projet

Le projet se structure en trois tiers :

1. **Client :**
   - Interface web (par exemple, une application SPA en React) pour la saisie des données, l'affichage des messages et la navigation.
2. **Serveur :**
   - Application back-end (par exemple, Node.js avec Express) exposant une API REST pour gérer la logique métier (utilisateurs, messages, relations d'amitié, etc.).
3. **Base de données :**
   - Stockage des données (utilisateurs, messages, etc.) via une solution (NoSQL comme MongoDB ou relationnelle).

## Services API REST

L'API REST fournie comporte plusieurs services, notamment :

- **Services liés aux utilisateurs :**
  - `createUser` (POST /api/user) : Créer un nouvel utilisateur.
  - `login` (POST /api/user/login) : Authentifier un utilisateur et établir une session.
  - `logout` (DELETE /api/user/{userid}/logout) : Fermer une session.
  - `getUser` (GET /api/user/{userid}) : Récupérer les informations d'un utilisateur.
  - `deleteUser` (DELETE /api/user/{userid}) : Supprimer un utilisateur.
  - `getUserInfo` (GET /api/user/infos) : Obtenir le nombre d'utilisateurs.

- **Services liés aux amis :**
  - `createFriend` (POST /apifriends/user/{userid}/friends) : Ajouter un ami.
  - `getListFriends` (GET /apifriends/user/{userid}/friends) : Lister les amis d’un utilisateur.
  - `getFriendRelationship` (GET /apifriends/user/{userid1}/friends/{userid2}) : Vérifier la relation d'amitié entre deux utilisateurs.
  - `deleteFriend` (DELETE /apifriends/user/{userid}/friends/{friendid}) : Supprimer une relation d'amitié.
  - `getFriendInfo` (GET /apifriends/user/{userid}/infos) : Obtenir des informations sur les relations d'amitié.

- **Services liés aux messages :**
  - `createMessage` (POST /apimessages/user/{userid}/messages) : Créer un nouveau message.
  - `setMessage` (PUT /apimessages/user/{userid}/messages) : Modifier un message.
  - `deleteMessage` (DELETE /apimessages/user/{userid}/messages) : Supprimer un message.
  - `getListMessage` (GET /apimessages/messages) : Récupérer tous les messages.
  - `getListMessageFromFriend` (GET /apimessages/user/{userid}/messages/{friendid}) : Récupérer les messages d'un ami.
  - `getListMessageFromAllFriend` (GET /apimessages/user/{userid}/messages/friends) : Récupérer les messages de tous les amis.
  - `getInfoMessageUser` (GET /apimessages/user/{userid}/infos) : Obtenir les statistiques de messages d'un utilisateur.
  - `getInfoAllMessage` (GET /apimessages/infos) : Obtenir les statistiques de messages de tous les utilisateurs.

## Outils et environnements

Pour tester l’API REST, il est nécessaire d’utiliser :

- **Postman** : Pour créer et organiser les requêtes de test dans une collection (ex. "testtme1-intro").
- **Navigateur web** : Pour tester les requêtes GET directement via l’URL.
- **Terminal** : Pour utiliser des commandes `curl` et sauvegarder ces commandes dans un fichier.

## Organisation des pages du site

Les pages principales à développer sont :

- **Page d’accueil** :  
  - Affiche le forum ouvert (liste des messages, zone de recherche, etc.).
  - Contient des liens vers les pages de connexion et d'enregistrement.

- **Page de connexion** :  
  - Formulaire de connexion accessible via le lien "Connexion".

- **Page d’enregistrement** :  
  - Formulaire d’enregistrement permettant de créer un compte.

- **Page profil** :  
  - Affiche le profil de l'utilisateur et la liste de ses messages.

---