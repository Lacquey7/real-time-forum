export const registerFormHTML = `
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
`;
