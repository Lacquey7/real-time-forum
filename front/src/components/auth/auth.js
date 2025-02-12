const Auth = {
  render: function () {
    return `
        <section id="auth-container" class="page active">
            <header id="head">
                <button data-action="show-auth" class="btn">REAL TIME FORUM</button>
            </header>

            <main id="auth-content">
                <div id="auth-buttons" class="auth-section active">
                   <button data-action="show-login" class="btn">Login</button>
                   <button data-action="show-register" class="btn">Register</button>
                </div>
                <div id="login-section" class="auth-section">
                <form id="login-form" class="auth-section">
                    <h2>Login</h2>
                    <div class="input-container">
                        <input type="text" id="login-email" placeholder="Email or Username" required>
                        <input type="password" id="login-password" placeholder="Password" required>
                        <div class="checkbox-container">
                            <input type="checkbox" id="remember-me">
                            <label for="remember-me">Remember me</label>
                        </div>
                    </div>
                    <div class="button-container">
                        <button type="submit">Login</button>
                        <button type="button" data-action="show-auth" class="back-btn">Back</button>
                    </div>
                    <div id="login-error" class="error-message"></div>
                    <div id="login-loading" class="loading-spinner hidden"></div>
                </form>
            </div>

            <div id="register-section" class="auth-section">
                <form id="register-form" class="auth-section">
                    <h2>Register</h2>
                    <div class="input-container">
                        <input type="text" id="register-nickname" placeholder="Nickname" required>
                        <input type="number" id="register-age" placeholder="Age" required>
                        <select id="register-gender" required>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        <input type="text" id="register-firstname" placeholder="First Name" required>
                        <input type="text" id="register-lastname" placeholder="Last Name" required>
                        <input type="email" id="register-email" placeholder="Email" required>
                        <input type="password" id="register-password" placeholder="Password" required>
                    </div>
                    <div class="button-container">
                        <button type="submit">Register</button>
                        <button type="button" data-action="show-auth" class="back-btn">Back</button>
                    </div>
                    <div id="register-error" class="error-message"></div>
                    <div id="register-loading" class="loading-spinner hidden"></div>
                </form>
            </div>
            </main>
        </section>
        `;
  },
  init: () => {
    console.log("Testing auth...");
    document
      .querySelector('[data-action="show-register"]')
      .addEventListener("click", () => {
        console.log("register button clicked");
      });

    // Test de soumission du formulaire
    document.getElementById("login-form").addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Form submitted with:", {
        email: document.getElementById("login-email").value,
        password: document.getElementById("login-password").value,
      });
    });
    // Navigation
    document.querySelectorAll("[data-action]").forEach((element) => {
      element.addEventListener("click", (e) => {
        const action = e.target.dataset.action;
        switch (action) {
          case "show-auth":
            Auth.showSection("auth-buttons");
            break;
          case "show-login":
            Auth.showSection("login-form");
            break;
          case "show-register":
            Auth.showSection("register-form");
            break;
        }
      });
    });

    // Event Listeners
    document
      .getElementById("login-form")
      .addEventListener("submit", Auth.handleLogin);
    document
      .getElementById("register-form")
      .addEventListener("submit", Auth.handleRegister);
  },

  showSection: (sectionId) => {
    console.log("Trying to show section:", sectionId);
    const sections = document.querySelectorAll(".auth-section");
    //console.log('Found sections:', sections.length);

    sections.forEach((section) => {
      section.style.display = "none";
      section.classList.remove("active");
      console.log("Removed active from:", section.id);
    });

    // Mise à jour des IDs ici
    const targetId =
      sectionId === "login-form"
        ? "login-section"
        : sectionId === "register-form"
        ? "register-section"
        : sectionId;

    const targetSection = document.getElementById(targetId);
    console.log("Target section:", targetSection);
    if (targetSection) {
      targetSection.style.display = "block";
      targetSection.classList.add("active");
      console.log("Added active to:", targetId);
    }

    // Gestion spéciale pour les boutons d'authentification
    const authButtons = document.getElementById("auth-buttons");
    if (authButtons) {
      authButtons.style.display =
        targetId === "auth-buttons" ? "block" : "none";
    }
  },

  handleLogin: function (e) {
    e.preventDefault();
    const errorElement = document.getElementById("login-error");

    // Valider le formulaire
    const errors = Auth.validateLoginForm();
    if (errors.length > 0) {
      errorElement.textContent = errors.join(". ");
      return;
    }

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const rememberMe = document.getElementById("remember-me").checked;

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, rememberMe }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          window.location.href = "/forum"; // ou votre page principale
        } else {
          throw new Error(data.message || "Login failed");
        }
      })
      .catch((error) => {
        errorElement.textContent = error.message;
      })
      .finally(() => {});
  },

  handleRegister: function (e) {
    e.preventDefault();
    const errorElement = document.getElementById("register-error");

    const formData = {
      email: document.getElementById("register-email").value.trim(),
      password: document.getElementById("register-password").value,
      username: document.getElementById("register-nickname").value.trim(),
      first_name: document.getElementById("register-firstname").value.trim(),
      last_name: document.getElementById("register-lastname").value.trim(),
      age: document.getElementById("register-age").value.toString(),
      genre: document.getElementById("register-gender").value,
    };
    console.log("Registering with:", formData);

    fetch("http://localhost:8080/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        const data = await response.json().catch((e) => {
          console.error("Erreur parsing JSON:", e);
          return {};
        });
        //console.log('Réponse du serveur:', data);

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }
        return data;
      })
      .then((data) => {
        // Succès de l'enregistrement
        Auth.showSection("login-form");
        const loginError = document.getElementById("login-error");
        loginError.style.color = "#4CAF50"; // Vert pour le succès
        loginError.textContent = "Registration successful! You can now log in.";
      })
      .catch((error) => {
        console.error("Erreur detaillée:", error);
        errorElement.textContent = error.message;
      })
      .finally(() => {});
  },

  validateLoginForm() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    const errors = [];

    if (!email) {
      errors.push("Email or username is required");
    }
    if (!password) {
      errors.push("Password is required");
    }
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    return errors;
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    Auth.showSection("auth-buttons");
    fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
  },
};
