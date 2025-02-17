<<<<<<< HEAD
import { loginFormHTML } from './template.js';
import Home from '../home-page/home.js';
import Register from '../register-page/register.js';

export default class LoginPage {
  constructor() {
    // a changer suivant comment on va faire
    document.addEventListener('DOMContentLoaded', () => {
      this.showLoginForm();
      this.registerPage = new Register();
    });
  }

  showLoginForm() {
    const loginForm = document.createElement('div');
    loginForm.classList.add('login-container');
    loginForm.innerHTML = loginFormHTML;

    document.body.appendChild(loginForm);

    document.getElementById('login-form').addEventListener('submit', this.handleLogin.bind(this));
    document.getElementById('register-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.registerPage.showRegisterForm();
    });
  }

  async handleLogin(e) {
=======
export function showLoginForm() {
  console.log("Showing login form");
  // Supprimer l'ancien modal s'il existe
  let oldModal = document.querySelector('.login-modal');
  if (oldModal) {
    console.log("Removing old modal");
    oldModal.remove();
  }

  console.log("Creating new modal");
  const modal = document.createElement('div');
  modal.classList.add('login-modal');
  modal.style.background = 'rgba(0, 0, 0, 0.8)';  // Assurer que le fond est visible
  document.body.appendChild(modal);

  console.log("Setting modal content");
  modal.innerHTML = `
        <div class="modal-content">
            <h2>RealTime Forum</h2>
            <form id="login-form">
                <div class="form-group">
                    <input type="email" id="reg-email" placeholder="Email" required>
                </div>
                <div class="form-group">
                    <input type="password" id="password" placeholder="Password" required>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    `;

  modal.style.display = 'flex';
  console.log("Modal should be visible now");

  document.getElementById('login-form').addEventListener('submit', async (e) => {
>>>>>>> origin/homepage
    e.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('password').value;

<<<<<<< HEAD
    // if (!this.validateEmail(email)) {
    //   alert('Invalid email!');
    //   return;
    // }

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
=======
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
>>>>>>> origin/homepage
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
<<<<<<< HEAD
        credentials: 'include', // Important pour inclure les cookies dans la requête
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login successful:', data);
        let webSocket = new WebSocket('ws://localhost:8080/ws');
        webSocket.onopen = function () {
          console.log('WebSocket connection opened');
          const home = new Home(); // Create new Home instance
          home.init(); // Initialize the home page
        };
      } else {
        alert(data.message || 'Login failed');
=======
      });

      if (response.ok) {

        modal.remove();
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
>>>>>>> origin/homepage
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
<<<<<<< HEAD
  }
}

new LoginPage();
=======
  });
}
>>>>>>> origin/homepage
