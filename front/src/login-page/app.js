document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.createElement('div');
  loginForm.classList.add('login-container');
  loginForm.innerHTML = `
      <form id="login-form">
          <h2>Login</h2>
          <div class="form-group">
              <input type="text" id="username" placeholder="Username" required>
          </div>
          <div class="form-group">
              <input type="password" id="password" placeholder="Password" required>
          </div>
          <button type="submit">Login</button>
          <p>Don't have an account? <a href="#" id="register-link">Register</a></p>
      </form>
  `;

  document.body.appendChild(loginForm);

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // if (!validateUsername(username)) {
    //   alert('Username is not valid');
    //   return;
    // }

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        window.location.href = '/home';
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
});

function showRegistrationForm() {
  const registerForm = document.createElement('div');
  registerForm.classList.add('login-container');
  registerForm.innerHTML = `
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
          <button type="submit">Register</button>
          <p>Already have an account? <a href="#" id="login-link">Login</a></p>
      </form>
  `;

  document.querySelector('.login-container').replaceWith(registerForm);

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;

    // if (!validateUsername(username)) {
    //   alert('Username must be at least 3 characters long and contain only letters, numbers, and underscores');
    //   return;
    // }

    if (!validateEmail(email)) {
      alert('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please login.');
        location.reload('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  });

  document.getElementById('login-link').addEventListener('click', (e) => {
    e.preventDefault();
    location.reload();
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

function validateUsername(username) {
  // verifier dans la base de donner si il existe pas deja le nom
}
