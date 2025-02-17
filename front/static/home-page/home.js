// home.js
import router from '../router.js';
import template from './template.js';

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
  },
};

async function handleLogout() {
  try {
    if (socket) {
      socket.close();
      console.log('NTM cookie');
      socket = null;
    }

    await fetch('http://localhost:8080/logout', {
      method: 'POST',
      credentials: 'include',
    });
    window.location.reload();
  } catch (error) {
    console.error('Logout error:', error);
  }
}

export default home;
