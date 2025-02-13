// home.app.js
import Router from "../singlePageRouting.js";

class HomePage {
    constructor() {
        this.init();
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
                <!-- Post 1 -->
                <div class="post">
                    <h2>Post Title</h2>
                    <p>Post Content</p>
                    <div class="post-actions">
                        <button>Modifier</button>
                        <button>Supprimer</button>
                    </div>
                </div>
                
                <!-- Post 2 -->
                <div class="post">
                    <h2>Post Title</h2>
                    <p>Post Content</p>
                    <div class="post-actions">
                        <button>Modifier</button>
                        <button>Supprimer</button>
                    </div>
                </div>
                
                <!-- Post 3 -->
                <div class="post">
                    <h2>Post Title</h2>
                    <p>Post Content</p>
                    <div class="post-actions">
                        <button>Modifier</button>
                        <button>Supprimer</button>
                    </div>
                </div>
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
    </div>
`;

        this.addEventListeners();
    }

    addEventListeners() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                console.log("Déconnexion en cours...");
                Router.logout();
            });
        }

        const submitPostBtn = document.getElementById('submit-post');
        if (submitPostBtn) {
            submitPostBtn.addEventListener('click', () => {
                this.createPost();
            });
        }
    }

    async createPost() {
        const content = document.getElementById('new-post').value;
        if (!content.trim()) return;

        // TODO: Implémenter la création de post
        console.log("Création d'un nouveau post:", content);
    }
}

// Initialiser la page quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    if (Router.isAuthenticated()) {
        new HomePage();
    } else {
        Router.navigateTo('auth');
    }
});

export default HomePage;