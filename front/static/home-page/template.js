// template.js
const template = {
    render: () => {
        return `
            <header class="header-container">
                <div class="title-global">
                    <h1 class="header">RealTime <span class="header-title">Forum</span></h1>
                </div>
                <div class="log-out">
                    <button class="log-out-button" id="logout-btn">Log out</button>
                </div>
            </header>

            <div class="main-container">
                <div class="post-container">
                    <h2>Posts</h2>
                    <div id="posts-container">
                        Loading content...
                    </div>
                </div>

                <div class="side-menu">
                    <h2>Messages</h2>
                    <div id="messages-container">
                        Loading messages...
                    </div>
                </div>

                <div class="add-post">
                    <button class="add-post-button" id="add-post-btn">+</button>
                </div>
            </div>
        `;
    }
};

export default template;