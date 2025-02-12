// singlePageRouting.js
const routes = {
    '/': showAuth,
    '/login': showLogin,
    '/register': showRegister,
    '/main': showMainPage
};

function showAuth() {
    showPage('auth-container');
    showAuthSection('auth-page');
}

function showLogin() {
    showPage('auth-container');
    showAuthSection('login-page');
}

function showRegister() {
    showPage('auth-container');
    showAuthSection('register-page');
}

function showMainPage() {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('main-page').classList.add('active');
}

// Modifier les gestionnaires de formulaires
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showMainPage();
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showMainPage();
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showAuthSection(sectionId) {
    document.querySelectorAll('.auth-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
}

// Gestionnaire d'événements
document.addEventListener('DOMContentLoaded', () => {
    // Router initial
    router();

    // Gestion du formulaire de login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // Après login réussi
        window.location.hash = '/main';
    });

    // Gestion du logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        window.location.hash = '/';
    });
});

function refreshMainPage() {
    // Rafraîchit la page principale
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById('main-page').classList.add('active');
}

function router() {
    const path = window.location.hash.slice(1) || '/';
    if (routes[path]) {
        routes[path]();
    } else {
        routes['/']();
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);