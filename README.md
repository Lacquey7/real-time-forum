# 🧵 Real-Time Forum

Forum interactif en temps réel développé avec **Go (backend)** et **JavaScript vanilla (frontend)**. Ce projet repose sur une architecture client-serveur propre, une gestion en temps réel des messages/notifications via **WebSockets**, et un backend RESTful robuste.

---

## 🚧 Architecture du Projet

### 🧩 Séparation Client / Serveur

- **Backend (Go)** :  
  Gère la logique métier, l’accès aux données, la gestion des sessions et expose une API REST.

- **Frontend (JavaScript vanilla)** :  
  Assure l’interface utilisateur, l’interaction avec l’API REST, et la communication en temps réel via WebSockets.

---

## 🔄 Communication Bidirectionnelle

| Type           | Usage                                       |
|----------------|---------------------------------------------|
| **API REST**   | Requêtes HTTP pour les opérations CRUD      |
| **WebSockets** | Notifications et messages en temps réel     |

---

## 🧠 Gestion des États et Sessions

- **Cookies HTTP** : Authentification persistante côté client.
- **Jetons de session** : Stockés en base de données avec date d’expiration.
- **État local frontend** : Pour une interface fluide sans rechargement de page.

---

## 🗃 Base de Données

- **SGBD** : SQLite
- **Tables principales** :  
  `USER`, `POST`, `COMMENT`, `LIKES`, `NOTIFICATION`, `MESSAGE`

---

## 🧭 Fonctionnement Global

### 🔐 Authentification

1. Accès à `login.js`
2. `sendLog()` envoie une requête `POST /login`
3. Traitement dans `handlers/login.go`
4. Création d’un cookie de session via `services/sessionToken.go`
5. Redirection vers la page principale via `router.js`

---

### 📝 Publication et Interaction

- Création de posts depuis une modale (`post-detail/post.js`)
- Traitement via `handlers/post.go` → insertion en base via `services/insertPost.go`
- Réactions (like/dislike) et commentaires générant des **notifications temps réel**

---

### 💬 Messagerie en Temps Réel

- Connexion WebSocket dans `router.js`
  ```js
  new WebSocket("ws://localhost:8080/ws")
  ```
- Gestion serveur dans `websocketFile/ws.go`
- Stockage via `services/insertPrivateMessage.go`
- Diffusion temps réel avec `hub.BroadcastPrivateMessage()`

---

### 🔔 Notifications en Temps Réel

- Lors de commentaires ou likes :
    - Enregistrement base de données
    - Création notification (`insertNotification.go`)
    - Événement WebSocket envoyé

---

## 📊 Schéma Conceptuel

```
Client                                Serveur (Go)
┌───────────────┐                   ┌────────────────────┐
│  UI Frontend  │◄────HTTP────────►│     Handlers       │
│ (JavaScript)  │                  │     (API REST)     │
└──────┬────────┘                   └────────┬───────────┘
       │                                       │
       ▼                                       ▼
┌─────────────┐                   ┌────────────────────┐
│ WebSocket   │◄──── Temps Réel ──►   Hub WebSocket    │
│  Client     │                   └────────┬───────────┘
└─────────────┘                            ▼
                                    ┌───────────────┐
                                    │   Services    │
                                    │ (BusinessLog) │
                                    └────────┬──────┘
                                             ▼
                                   ┌─────────────────┐
                                   │ SQLite Database │
                                   └─────────────────┘
```

---

## 🛠️ Fichiers Clés

| Fichier / Dossier                | Rôle |
|----------------------------------|------|
| `router.js`                      | Routage client, init WebSocket |
| `handlers/*.go`                  | Gestion des routes REST |
| `websocketFile/hub.go`          | Gestion centrale des connexions WebSocket |
| `services/sessionToken.go`      | Authentification sécurisée |
| `services/insertNotification.go`| Insertion des notifications |
| `services/insertPrivateMessage.go` | Stockage des messages |
| `main.go`                        | Démarrage serveur, middlewares, CORS, etc. |

---

## 🚀 Lancer le projet

1. **Backend**
   ```bash
   go run server/main.go
   ```

2. **Frontend**
   Ouvrir `index.html` dans un navigateur ou servir avec un serveur local.

---

## ✅ Fonctionnalités à tester

- [x] Inscription / Connexion sécurisée
- [x] Création, édition et suppression de posts
- [x] Like / Dislike de posts
- [x] Commentaires en temps réel
- [x] Messagerie privée instantanée
- [x] Notifications dynamiques

---

## 📌 À propos

Ce projet a été conçu pour explorer les technologies **Go**, **WebSockets**, et **JavaScript vanilla** dans un contexte **fullstack** temps réel, avec une base solide en **sécurité**, **gestion des sessions**, et **UX fluide**.


## 👥 Contributeurs

- [MOHAMED TLICHE](https://github.com/Lacquey7)
- [ROMAIN SAVARY](https://github.com/MrFruchard)


<!-- Tu peux ajouter d'autres contributeurs ici :
- [Mohamed Tliche](https://github.com/autre-contributeur)
-->