import Router from "../singlePageRouting.js";


  // Ajouter l'écouteur pour le bouton logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Router.logout();
    });
  }

  // Ensuite initialiser le routeur
  Router.init();

  // Puis afficher le formulaire de login
  showLoginForm();


function showLoginForm() {
  const loginForm = document.createElement('div');
  loginForm.classList.add('login-container');
  loginForm.innerHTML = `
<div id="auth-container" class="page">
      <form id="login-form">
          <h2>Login</h2>
         <div class="form-group">
              <input type="email" id="reg-email" placeholder="Email" required>
          </div>
          <div class="form-group">
              <input type="password" id="password" placeholder="Password" required>
          </div>
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="#" id="register-link">Register</a></p>
      </form>
    </div>
  `;

  document.body.appendChild(loginForm);

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('password').value;

    if (!validateEmail(email)) {
      alert('Invalid email!');
      return;
    }

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
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userData', JSON.stringify({ message: data.message }));
        const homeUrl = new URL('/home', window.location.origin);
        localStorage.setItem('accessToken', data.token); // stocke le token
        Router.navigateTo('main'); // utilise le routeur
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  });

  document.getElementById('register-link').addEventListener('click', (e) => {
    e.preventDefault();
    showRegistrationForm();
  });
}

function showRegistrationForm() {
  const registerForm = document.createElement('div');
  registerForm.classList.add('login-container');
  registerForm.innerHTML = `
<div id="auth-container" class="page">
      <form id="register-form">
          <h2>Register</h2>
          <div class="form-group">
              <input type="text" id="reg-username" placeholder="Username" required>
          </div>
          <div class="form-group">
              <input type="email" id="reg-email" placeholder="Email" required>
          </div>
          <div class="form-group">
              <input type="password" id="reg-password" placeholder="Password" required>
          </div>
          <div class="form-group">
              <input type="password" id="reg-confirm-password" placeholder="Confirm Password" required>
          </div>
          <div class="form-group">
              <input type="text" id="reg-firstname" placeholder="First Name" required>
          </div>
          <div class="form-group">
              <input type="text" id="reg-lastname" placeholder="Last Name" required>
          </div>
          <div class="form-group">
              <input type="number" id="reg-age" placeholder="Age" min="18" max="120" required>
          </div>
          <div class="form-group">
              <select id="reg-genre" required>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
              </select>
          </div>
          <button type="submit">Register</button>
          <p>Already have an account? <a href="#" id="login-link">Login</a></p>
      </form>
    </div>
  `;

  document.querySelector('.login-container').replaceWith(registerForm);

  document.getElementById('register-form').addEventListener('submit', async (e) => {
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

    if (!validateEmail(email)) {
      alert('Invalid email!');
      return;
    }

    //Pour les test on enlever la validation du mot de passe
    // if (!validatePassword(password)) {
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
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please login.');
        Router.navigateTo('auth')
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  });

  document.getElementById('login-link').addEventListener('click', (e) => {
    e.preventDefault();
    Router.navigateTo('auth');
  });
}

function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return regex.test(password);
}
