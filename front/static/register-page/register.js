import { registerFormHTML } from './template.js';
// import Home from '../home-page/home.js';
import LoginPage from '../login-page/login.js';

export default class Register {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.showRegisterForm();
      this.loginPage = new LoginPage();
    });
  }

  showRegisterForm() {
    const registerForm = document.createElement('div');
    registerForm.classList.add('login-container');
    registerForm.innerHTML = registerFormHTML;

    document.querySelector('.login-container').replaceWith(registerForm);

    document.getElementById('register-form').addEventListener('submit', this.handleRegister.bind(this));
    document.getElementById('login-link').addEventListener('click', (e) => {
      e.preventDefault();
      this.loginPage.showLoginForm();
    });
  }

  async handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const firstName = document.getElementById('reg-firstname').value;
    const lastName = document.getElementById('reg-lastname').value;
    const age = document.getElementById('reg-age').value;
    const genre = document.getElementById('reg-genre').value;

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // if (!this.validateEmail(email)) {
    //   alert('Invalid email!');
    //   return;
    // }
    //Pour les test on enlever la validation du mot de passe
    // if (!this.validatePassword(password)) {
    //   alert('Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number');
    //   return;
    // }

    try {
      const response = await fetch('http://localhost:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
          first_name: firstName,
          last_name: lastName,
          age: age,
          genre: genre,
        }),
        credentials: 'include', // Important pour inclure les cookies dans la requête
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        window.location.href = '/';
      } else {
        console.error('Registration failed:', data);
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('register error:', error);
      alert('Registration failed. Please try again.');
    }
  }
}
