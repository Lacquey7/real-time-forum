<<<<<<< HEAD
// Home page functionality
export default class HomePage {
  constructor() {
    this.init();
  }

  init() {
    this.container = document.createElement('div');
    this.container.id = 'home-container';
    this.createContent();
    document.body.appendChild(this.container);
  }

  createContent() {
    // Create welcome message
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-message';
    welcomeDiv.innerHTML = `
            <h1>Welcome to Real Time Forum</h1>
            <p>This is a test home page</p>
        `;

    // Create test buttons
    const buttonSection = document.createElement('div');
    buttonSection.className = 'button-section';

    const testButton = document.createElement('button');
    testButton.textContent = 'Test Button';
    testButton.addEventListener('click', () => this.handleTestClick());

    buttonSection.appendChild(testButton);
    this.container.appendChild(welcomeDiv);
    this.container.appendChild(buttonSection);
  }

  handleTestClick() {
    alert('Test button clicked!');
  }
}
=======
// home.js
import router from "../router.js";
import template from "./template.js";

let socket = null;

const home = {
    render: async () => {
        return template.render();
    },

    afterRender: async () => {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        // Établir la connexion WebSocket
        if (!socket) {
            socket = new WebSocket('ws://localhost:8080/ws');
            socket.addEventListener('open', () => {
                console.log('Connected to WebSocket');
            });
        }
    }
};

async function handleLogout() {
    try {
        if (socket) {
            socket.close();
            console.log("NTM cookie")
            socket = null;
        }

        await fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include'
        });
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

export default home;
>>>>>>> origin/homepage
