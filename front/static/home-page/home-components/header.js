import { closeWebSocket, router } from "../../router.js";

export const header = () => {
    const header = document.createElement("header");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.padding = "15px";
    header.style.backgroundColor = "rgb(0,0,0)";
    header.style.color = "#fff";
    header.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";

    const appName = document.createElement("h1");
    appName.textContent = "Real time forum";
    appName.style.margin = "0";
    appName.style.fontSize = "1.5rem";
    appName.style.textAlign = "center";

    const actionsContainer = document.createElement("div");
    actionsContainer.style.display = "flex";
    actionsContainer.style.alignItems = "center";
    actionsContainer.style.gap = "15px";

    // Bouton de notification
    const notifButton = document.createElement("button");
    notifButton.innerHTML = `
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
          <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.64 5.36 6 7.92 6 11v5l-1 1v1h16v-1l-1-1z"/>
      </svg>`;
    notifButton.style.display = "flex";
    notifButton.style.alignItems = "center";
    notifButton.style.justifyContent = "center";
    notifButton.style.background = "none";
    notifButton.style.border = "none";
    notifButton.style.cursor = "pointer";
    notifButton.style.color = "#fff";
    notifButton.addEventListener("click", () => {
        alert("Aucune nouvelle notification !");
    });

    // Bouton de déconnexion
    const logoutButton = document.createElement("button");
    logoutButton.innerHTML = `
      <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" style="margin-right: 5px;">
          <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
      </svg> Déconnexion`;
    logoutButton.style.display = "flex";
    logoutButton.style.alignItems = "center";
    logoutButton.style.backgroundColor = "#e31414";
    logoutButton.style.color = "#fff";
    logoutButton.style.border = "none";
    logoutButton.style.cursor = "pointer";
    logoutButton.style.borderRadius = "5px";
    logoutButton.style.padding = "8px 12px";

    logoutButton.addEventListener("click", async () => {
        try {
            const response = await fetch("/logout", {
                method: "POST",
                credentials: "include", // 🔥 Important pour les cookies de session
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors de la déconnexion");
            }

            closeWebSocket();  // Fermer la connexion WebSocket
            router();  // Rediriger après déconnexion
        } catch (error) {
            console.error("Erreur lors de la requête de déconnexion :", error);
            alert("Erreur lors de la déconnexion. Veuillez réessayer.");
        }
    });

    actionsContainer.appendChild(notifButton);
    actionsContainer.appendChild(logoutButton);

    header.appendChild(appName);
    header.appendChild(actionsContainer);

    const app = document.querySelector("#app");
    if (app) {
        app.prepend(header);
    }
};