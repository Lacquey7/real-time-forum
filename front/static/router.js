// router.js
import home from './home-page/home.js';
import { showLoginForm } from './login-page/login.js';

const router = {
    init: async () => {
        window.addEventListener('popstate', router.handleLocation);
        await router.checkAndRender();
    },

    handleLocation: async () => {
        await router.checkAndRender();
    },

    navigateTo: async (path) => {
        window.history.pushState({}, '', path);
        await router.handleLocation();
    },

    async checkAuth() {
        try {
            const response = await fetch('http://localhost:8080/check-auth', {
                credentials: 'include'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    async checkAndRender() {
        console.log("Checking authentication...");
        const isAuthenticated = await router.checkAuth();
        console.log("Is authenticated:", isAuthenticated);
        const container = document.getElementById('app');

        if (!isAuthenticated) {
            console.log("Not authenticated, showing login form");
            if (container) {
                container.innerHTML = '';
            }
            showLoginForm();
            return;
        }

        console.log("Authenticated, rendering home");
        await router.render();
        //showLoginForm()
    },

    render: async () => {
        const container = document.getElementById('app');
        if (!container) return;

        try {
            container.innerHTML = await home.render();
            await home.afterRender();
        } catch (error) {
            console.error('Render error:', error);
        }
    }
};
export default router;