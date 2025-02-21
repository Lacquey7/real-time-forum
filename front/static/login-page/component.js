export const loginComponent = () => {
        // Vider complètement le `body`
        document.body.innerHTML = "";

        // Créer un conteneur principal
        const container = document.createElement("div");
        container.id = "login-container";
        container.style.display = "flex";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        container.style.height = "100vh";
        container.style.flexDirection = "column";

        // Ajouter un titre
        const title = document.createElement("h1");
        title.innerText = "Connexion au Forum";
        container.appendChild(title);

        // Créer un formulaire de connexion
        const form = document.createElement("form");

        // Champ email
        const emailLabel = document.createElement("label");
        emailLabel.innerText = "Email : ";
        const emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.placeholder = "Entrez votre email";
        emailInput.required = true;

        // Champ mot de passe
        const passLabel = document.createElement("label");
        passLabel.innerText = "Mot de passe : ";
        const passInput = document.createElement("input");
        passInput.type = "password";
        passInput.placeholder = "Entrez votre mot de passe";
        passInput.required = true;

        // Bouton de connexion
        const submitButton = document.createElement("button");
        submitButton.innerText = "Se connecter";
        submitButton.type = "submit";

        // Ajout des éléments au formulaire
        form.appendChild(emailLabel);
        form.appendChild(emailInput);
        form.appendChild(document.createElement("br"));
        form.appendChild(passLabel);
        form.appendChild(passInput);
        form.appendChild(document.createElement("br"));
        form.appendChild(submitButton);

        // Ajout du formulaire au conteneur
        container.appendChild(form);

        // Ajouter l'événement de connexion
        form.addEventListener("submit", (event) => {
            event.preventDefault(); // Empêcher le rechargement de la page
            console.log("Tentative de connexion avec :", emailInput.value, passInput.value);

            // Tu peux ici ajouter une requête vers ton backend pour vérifier l'utilisateur
            // fetch("/api/login", { method: "POST", body: JSON.stringify({ email: emailInput.value, password: passInput.value })})

            alert("Connexion réussie (simulation)");
        });

        // Ajouter tout au body
        document.body.appendChild(container);
}