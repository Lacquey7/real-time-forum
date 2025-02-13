// home.app.js
import Router from "../singlePageRouting.js";
import wsService from "../webSocketService.js";

class HomePage {
    constructor() {
        this.init();
        this.initWebSocket();
    }

    init() {
        const mainContainer = document.getElementById('main-container');
        if (!mainContainer) {
            console.error("Container principal non trouvé!");
            return;
        }

        mainContainer.innerHTML = `
    <!-- Header fixe -->
    <header class="home-header">
        <h1>Real-Time-Forum</h1>
        <div class="user-info">
            <span id="user-name">Test User</span>
            <button id="logout-btn">Déconnexion</button>
        </div>
    </header>

    <!-- Layout principal sous le header -->
    <div class="home-layout">
        <!-- Contenu principal -->
        <main class="home-content">
            <div id="posts-container">
                <!-- Les posts seront ajoutés ici -->
            </div>
        </main>

        <!-- Barre latérale -->
        <aside class="sidebar">
            <div class="conversations">
                <h3>Messages</h3>
                <div id="conversations-list">
                    <!-- Les conversations seront ajoutées ici -->
                </div>
            </div>
        </aside>

        <!-- Bouton nouveau post -->
        <button id="new-post-btn">❤️</button>

        <!-- Modale pour nouveau post -->
        <div id="post-modal" style="display: none;" class="post-modal">
            <div class="post-modal-content">
                <h2>Nouveau Post</h2>
                <textarea id="new-post" placeholder="Écrivez votre message..."></textarea>
                <div class="post-modal-actions">
                    <button id="submit-post">Publier</button>
                    <button id="cancel-post">Annuler</button>
                </div>
            </div>
        </div>
    </div>
`;

        this.addEventListeners();
    }

    initWebSocket() {
        wsService.connect();

        wsService.on('newPost', (message) => {
            console.log('Nouveau post reçu:', message);
            this.addPostToDOM(message.content);
        });
    }

    addEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log("Déconnexion en cours...");
                Router.logout();
            });
        }

        // Gestionnaire pour ouvrir la modale
        const newPostBtn = document.getElementById('new-post-btn');
        if (newPostBtn) {
            newPostBtn.addEventListener('click', () => {
                const modal = document.getElementById('post-modal');
                modal.style.display = 'flex';
            });
        }

        // Gestionnaire pour soumettre le post
        const submitPostBtn = document.getElementById('submit-post');
        if (submitPostBtn) {
            submitPostBtn.addEventListener('click', () => {
                this.createPost();
            });
        }

        // Gestionnaire pour fermer la modale
        const cancelPostBtn = document.getElementById('cancel-post');
        if (cancelPostBtn) {
            cancelPostBtn.addEventListener('click', () => {
                const modal = document.getElementById('post-modal');
                modal.style.display = 'none';
                document.getElementById('new-post').value = '';
            });
        }
    }

    async createPost() {
        const content = document.getElementById('new-post').value;
        if (!content.trim()) return;

        // Envoie le nouveau post via WebSocket
        wsService.send('newPost', {
            content: content,
            date: new Date().toISOString(),
            author: document.getElementById('user-name').textContent
        });

        // Ferme la modale et vide le champ
        document.getElementById('post-modal').style.display = 'none';
        document.getElementById('new-post').value = '';
    }

    addPostToDOM(postData) {
        const postsContainer = document.getElementById('posts-container');
        const postElement = document.createElement('div');
        postElement.className = 'post';

        const date = new Date(postData.date).toLocaleString();

        postElement.innerHTML = `
            <div class="post-header">
                <span class="post-author">${postData.author}</span>
                <span class="post-date">${date}</span>
            </div>
            <div class="post-content">
                ${postData.content}
            </div>
            <div class="post-actions">
                <button class="edit-btn">Modifier</button>
                <button class="delete-btn">Supprimer</button>
            </div>
        `;

        postsContainer.insertBefore(postElement, postsContainer.firstChild);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    if (Router.isAuthenticated()) {
        new HomePage();
    } else {
        Router.navigateTo('auth');
    }
});

export default HomePage;