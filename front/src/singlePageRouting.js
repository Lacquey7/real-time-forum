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
        try {
            window.addEventListener('load', () => this.handleRoute());
            window.addEventListener('hashchange', () => this.handleRoute());
            this.handleRoute();
        } catch (error) {
            console.error('Router initialization failed:', error);
            this.handleError(error);
        }
    },

    handleRoute() {
        try {
            const isAuth = this.isAuthenticated();
            const currentHash = window.location.hash.slice(1) || 'auth';

            // Vérifie si la page existe
            if (!this.pages[currentHash]) {
                throw new Error(`Page "${currentHash}" not found`);
            }

            // Vérifie l'authentification
            if (this.pages[currentHash].auth && !isAuth) {
                this.navigateTo('auth');
                return;
            }

            this.showPage(currentHash);
        } catch (error) {
            console.error('Routing error:', error);
            this.handleError(error);
        }
    },

    showPage(pageId) {
        try {
            // Vérifie si le conteneur principal existe
            const app = document.getElementById('app');
            if (!app) {
                throw new Error('App container not found');
            }

            // Cache toutes les pages
            const pages = document.querySelectorAll('.page');
            if (pages.length === 0) {
                throw new Error('No pages found with class "page"');
            }

            pages.forEach(page => {
                page.style.display = 'none';
            });

            // Affiche la page demandée
            const page = document.getElementById(this.pages[pageId].id);
            if (!page) {
                throw new Error(`Page container "${this.pages[pageId].id}" not found`);
            }

            page.style.display = 'block';
        } catch (error) {
            console.error('Display error:', error);
            this.handleError(error);
        }
    },

    navigateTo(pageId) {
        try {
            if (!this.pages[pageId]) {
                throw new Error(`Invalid page: ${pageId}`);
            }

            window.location.hash = pageId;
            this.handleRoute();
        } catch (error) {
            console.error('Navigation error:', error);
            this.handleError(error);
        }
    },

    handleError(error) {
        // Affiche une erreur à l'utilisateur
        const errorContainer = document.getElementById('error-container');
        if (errorContainer) {
            errorContainer.textContent = 'An error occurred: ' + error.message;
            errorContainer.style.display = 'block';

            // Cache l'erreur après 5 secondes
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        }

        // En cas d'erreur critique, retourne à la page d'auth
        if (!document.querySelector('.page[style*="block"]')) {
            this.navigateTo('auth');
        }
    },

    isAuthenticated() {
        return localStorage.getItem('accessToken') !== null;
    },

    logout() {
        localStorage.removeItem('accessToken');
        this.navigateTo('auth');
    }


};
// Navigation
Router.navigateTo('main');

// Gestion de la déconnexion
logoutButton.addEventListener('click', () => Router.logout());

export default Router;