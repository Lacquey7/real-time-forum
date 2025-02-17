export function showLoginForm() {
  console.log('Showing login form');
  // Supprimer l'ancien modal s'il existe
  let oldModal = document.querySelector('.login-modal');
  if (oldModal) {
    console.log('Removing old modal');
    oldModal.remove();
  }

  console.log('Creating new modal');
  const modal = document.createElement('div');
  modal.classList.add('login-modal');
  modal.style.background = 'rgba(0, 0, 0, 0.8)'; // Assurer que le fond est visible
  document.body.appendChild(modal);

  console.log('Setting modal content');
  modal.innerHTML = `
    <div class="modal-content">
        <h2 class="header">RealTime <span class="header-title">Forum</span></h2>
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
  console.log('Modal should be visible now');

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        modal.remove();
        //window.location.reload();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  });
}
