export const privateMessage = (data) => {
    if (!data || !Array.isArray(data) || data.length < 3) return;

    const [msg, user, timestamp] = data;

    console.log("📩 Nouveau message privé reçu de :", user, "| Message :", msg, "| Heure :", timestamp);

    // Vérifie si la modal du bon utilisateur est ouverte
    const modal = document.getElementById("chat-modal");
    if (!modal) {
        console.warn("⚠️ Aucun chat modal ouvert pour cet utilisateur.");
        return;
    }

    const chatUser = modal.querySelector(".chat-user").textContent;
    if (chatUser !== user) {
        console.warn(`⚠️ Message reçu de ${user}, mais la modal est ouverte pour ${chatUser}.`);
        return;
    }

    // Sélectionne le body du chat
    const chatBody = modal.querySelector("#chat-body");

    // Formatte l'heure au format YYYY-MM-DD HH:mm:ss
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).replace(",", ""); // Supprime la virgule inutile

    // Crée un élément de message reçu
    const messageElement = document.createElement("div");
    messageElement.classList.add("chat-message", "received");

    // Ajoute le message dans une structure claire
    messageElement.innerHTML = `
        <p>${msg}</p>  
        <small class="chat-time">${formattedTime}</small>
    `;

    // Ajoute le message au chat
    chatBody.appendChild(messageElement);

    // Fait défiler vers le dernier message
    chatBody.scrollTop = chatBody.scrollHeight;
};