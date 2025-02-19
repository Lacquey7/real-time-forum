// home.js
import router from '../router.js';
import template from './template.js';
import { connectWebsocket, showLoginForm } from '../login-page/login.js';
import createPost from './post-detail/post.js';

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
      socket.addEventListener('close', () => {
        console.log('WebSocket closed');
        showLoginForm();
      });
    }
    connectWebsocket();
    await handlePost();
  },
};

export async function handlePost() {
  try {
    const response = await fetch('http://localhost:8080/post', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      data.forEach((post) => createPost(post));
    } else {
      throw new Error('Failed to fetch posts');
    }
  } catch (error) {
    console.error('Post error:', error);
  }
}

async function handleLogout() {
  try {
    if (socket) {
      socket.close();
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
