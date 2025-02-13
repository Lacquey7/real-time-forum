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
    e.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('password').value;

    // if (!this.validateEmail(email)) {
    //   alert('Invalid email!');
    //   return;
    // }

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
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
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  }
}

new LoginPage();
