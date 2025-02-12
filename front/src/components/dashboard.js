const dashboard = () => {
    render : async () => {
        return `
        <!-- Page d'accueil -->
        <section id="main-page" class="page">
    <header id="main-header">
        <div></div>  -- Première colonne vide --
        <button data-action="show-main" class="btn title-btn">REAL TIME FORUM</button>
        <button data-action="show-auth" class="btn logout-btn">Logout</button>
    </header>

    <div class="main-content">
        <div id="posts-section">
            <h2>Posts</h2>
            <div class="posts-container">
                -- Les posts seront injectés ici --
            </div>
        </div>

        <div id="messages-section">
            <h2>Messages</h2>
            <div class="messages-container">
                -- Les messages seront injectés ici --
            </div>
        </div>
    </div>
</section>
`;

},
        init : () => {
        document.querySelectorAll('data.action').forEach(element => {
            element.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                switch (action) {
                    case 'show-main':
                        showMainPage('');
                        break;
                    case 'show-auth':
                        Auth.showSection('auth-buttons');
                        break;
                    default:
                        break;
                }
            });
        });
    },
};

