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

    async checkAndRender() {
        const container = document.getElementById('app');
        if (!container) return;

        try {
            container.innerHTML = await home.render();
            await home.afterRender();
        } catch (error) {
            console.error('Render error:', error);
        }
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