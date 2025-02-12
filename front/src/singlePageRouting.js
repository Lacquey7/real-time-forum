// singlePageRouting.js

const Router = {
    pages: {
        'auth': {
            id: 'auth-container',
            auth: false
        },
        'main': {
            id: 'main-container',
            auth: true
        }
    },

    init() {
        window.addEventListener('load', () => this.handleRoute());
        window.addEventListener('hashchange', () => this.handleRoute());

        // Redirection vers auth par défaut si pas de hash
        if (!window.location.hash) {
            window.location.hash = 'auth';
        }

        this.handleRoute();
    },

    handleRoute() {
        const isAuth = this.isAuthenticated();
        const currentHash = window.location.hash.slice(1);

        // Si pas de hash ou hash invalide, rediriger vers auth
        if (!currentHash || !this.pages[currentHash]) {
            if (currentHash && !this.pages[currentHash]) {
                this.handleError(new Error(`Invalid page: ${currentHash}`));
            }
            window.location.hash = 'auth';
            return;
        }

        // Vérification de l'authentification pour les routes protégées
        if (this.pages[currentHash].auth && !isAuth) {
            window.location.hash = 'auth';
            return;
        }

        this.showPage(currentHash);
    },

    showPage(pageId) {
        // Cache toutes les pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });

        // Affiche la page demandée
        const page = document.getElementById(this.pages[pageId].id);
        if (!page) {
            this.handleError(new Error(`Page container "${this.pages[pageId].id}" not found`));
            return;
        }

        page.style.display = 'block';
    },

    navigateTo(pageId) {
        if (!this.pages[pageId]) {
            this.handleError(new Error(`Invalid page: ${pageId}`));
            return;
        }

        // Vérifie l'authentification pour les routes protégées
        if (this.pages[pageId].auth && !this.isAuthenticated()) {
            window.location.hash = 'auth';
            return;
        }

        window.location.hash = pageId;
    },

    handleError(error) {
        console.error('Router error:', error);

        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.textContent = 'An error occurred: ' + error.message;
            errorContainer.style.display = 'block';

            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        }
    },

    isAuthenticated() {
        return localStorage.getItem('accessToken') !== null;
    },

    logout() {
        localStorage.removeItem('accessToken');
        window.location.hash = 'auth';
    }
};

export default Router;