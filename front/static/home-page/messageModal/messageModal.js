import { refreshConversations } from "../home-components/body.js";
import { socket } from "../../router.js";

export const messageModal = async (user) => {
  console.log("✅ messageModal appelée avec :", user);

  // Vérifier si une modal est déjà ouverte (via la classe .chat-modal)
  const existingModal = document.querySelector(".chat-modal");
  if (existingModal) {
    console.log(
        "⚠️ Une autre modal est déjà ouverte, on la supprime avant d'en ouvrir une nouvelle."
    );
    existingModal.remove();
  }

  // Création du conteneur du modal
  const modal = document.createElement("div");
  modal.id = `chat-modal-${user}`;
  modal.classList.add("chat-modal"); // <-- classe pour le style

  // Structure du contenu de la modal
  modal.innerHTML = `
    <div class="chat-header">
      <span class="chat-user">${user}</span>
      <button class="chat-close">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
             viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="chat-body" id="chat-body">
      <p class="chat-message received">Chargement des messages...</p>
    </div>
    <div class="chat-footer">
      <input type="text" id="chat-input" placeholder="Écrire un message..." />
      <button id="chat-send">➤</button>
    </div>
  `;

  // Ajout de la modal au DOM
  document.body.appendChild(modal);
  console.log("✅ Nouvelle modal ajoutée :", modal);

  // Sélection des éléments interactifs
  const closeButton = modal.querySelector(".chat-close");
  const inputField = modal.querySelector("#chat-input");
  const sendButton = modal.querySelector("#chat-send");
  const chatBody = modal.querySelector("#chat-body");

  // Fermer la modal au clic sur le bouton close
  closeButton.addEventListener("click", () => {
    console.log("❌ Modal fermée.");
    modal.remove();
  });

  // Fonction pour formater la date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date
        .toLocaleString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(",", "");
  };

  // Stockage de tous les messages récupérés du serveur
  let allMessages = [];
  const MESSAGES_PER_LOAD = 10; // Nombre de messages à charger à la fois
  let currentOffset = 0; // Pour suivre le nombre de messages déjà chargés

  // Fonction de throttle pour limiter les appels lors du défilement
  function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = new Date().getTime();
      if (now - lastCall >= delay) {
        func.apply(this, args);
        lastCall = now;
      }
    };
  }

  // Fonction pour charger les messages via GET
  const loadMessages = async (user) => {
    const chatBody = document.querySelector(`#chat-modal-${user} .chat-body`);
    if (!chatBody) return;

    // Si nous avons déjà les messages, pas besoin de refaire l'appel API
    if (allMessages.length > 0) {
      displayBatchOfMessages(user, currentOffset);
      return;
    }

    const url = `http://localhost:8080/message?user=${user}`;
    console.log("📡 Requête GET pour récupérer tous les messages de l'utilisateur :", user);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

      // Stockage de tous les messages
      allMessages = await response.json();
      console.log("✅ Nombre total de messages reçus :", allMessages.length);

      // Nettoyer la zone d'affichage
      chatBody.innerHTML = "";

      if (!allMessages || allMessages.length === 0) {
        chatBody.innerHTML = `<p class="chat-message received">
          Aucun message pour le moment. Soyez le premier à envoyer un message !
        </p>`;
        return;
      }

      // Trions les messages du plus récent au plus ancien
      allMessages.sort((a, b) => new Date(b.date) - new Date(a.date));

      // Affichage des premiers messages (les plus récents)
      displayBatchOfMessages(user, 0);

    } catch (error) {
      chatBody.innerHTML = `<p class="chat-message received">
        Erreur de chargement des messages.
      </p>`;
      console.error("❌ Erreur lors du chargement des messages :", error);
    }

    return Promise.resolve();
  };

  // Fonction pour afficher un lot de messages
  const displayBatchOfMessages = (user, offset) => {
    const chatBody = document.querySelector(`#chat-modal-${user} .chat-body`);
    if (!chatBody) return;

    // Si c'est le premier chargement (offset = 0), on vide le contenu
    if (offset === 0) {
      chatBody.innerHTML = "";
    }

    // Calcul de l'index de début et de fin pour ce lot
    const startIndex = offset;
    const endIndex = Math.min(startIndex + MESSAGES_PER_LOAD, allMessages.length);

    // Si on a déjà affiché tous les messages, on arrête
    if (startIndex >= allMessages.length) {
      // Ajouter un marqueur de fin
      if (!chatBody.querySelector(".chat-end-marker")) {
        const endMarker = document.createElement("div");
        endMarker.classList.add("chat-end-marker");
        endMarker.textContent = "Début de la conversation";
        chatBody.insertBefore(endMarker, chatBody.firstChild);
      }
      return;
    }

    // Sauvegarde la position actuelle de défilement avant d'ajouter les nouveaux messages
    const scrollPosition = chatBody.scrollTop;
    const oldHeight = chatBody.scrollHeight;

    // Créer un fragment pour améliorer les performances
    const fragment = document.createDocumentFragment();

    // Récupération du lot de messages à afficher
    const messagesToDisplay = allMessages.slice(startIndex, endIndex);

    // Affichage des messages
    messagesToDisplay.forEach(({ sender, message, date }) => {
      const messageElement = document.createElement("p");
      messageElement.classList.add(
          "chat-message",
          sender === user ? "received" : "sent"
      );
      messageElement.innerHTML = `${message} <br><small>${formatDate(date)}</small>`;
      fragment.appendChild(messageElement);
    });

    // Ajout des messages au début du chatBody (car on affiche du plus récent au plus ancien)
    const firstChild = chatBody.firstChild;
    if (firstChild) {
      chatBody.insertBefore(fragment, firstChild);
    } else {
      chatBody.appendChild(fragment);
    }

    // Si ce n'est pas le premier chargement (offset > 0), on maintient la position
    if (offset > 0) {
      // Restaure la position de défilement après avoir ajouté les nouveaux messages
      chatBody.scrollTop = scrollPosition + (chatBody.scrollHeight - oldHeight);
    } else {
      // Scroll automatique vers le dernier message pour le premier chargement
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Mise à jour de l'offset pour le prochain chargement
    currentOffset = endIndex;

    // Si on a affiché tous les messages, ajouter un marqueur de fin
    if (endIndex >= allMessages.length && !chatBody.querySelector(".chat-end-marker")) {
      const endMarker = document.createElement("div");
      endMarker.classList.add("chat-end-marker");
      endMarker.textContent = "Début de la conversation";
      chatBody.insertBefore(endMarker, chatBody.firstChild);
    }
  };

  // Fonction pour configurer le défilement infini
  const setupInfiniteScroll = (user) => {
    const chatBody = document.querySelector(`#chat-modal-${user} .chat-body`);
    if (!chatBody) return;

    const handleScroll = throttle(() => {
      // Si l'utilisateur est proche du haut du chat (remonte l'historique)
      if (chatBody.scrollTop < 50) {
        // Si on a déjà un chargement en cours, on ignore
        if (chatBody.dataset.isLoading === "true") return;

        // Si on a déjà un marqueur de fin, on n'en fait pas plus
        if (chatBody.querySelector(".chat-end-marker")) return;

        // Marquer comme en cours de chargement
        chatBody.dataset.isLoading = "true";

        console.log("📜 Chargement de plus de messages à l'offset:", currentOffset);

        // Charger le prochain lot de messages
        displayBatchOfMessages(user, currentOffset);

        // Après un court délai, permettre de recharger
        setTimeout(() => {
          chatBody.dataset.isLoading = "false";
        }, 500);
      }
    }, 300);

    chatBody.addEventListener('scroll', handleScroll);
    return () => chatBody.removeEventListener('scroll', handleScroll);
  };

  // Initialisation de la conversation
  const initConversation = async (user) => {
    // Réinitialiser les variables globales
    allMessages = [];
    currentOffset = 0;

    // Charger tous les messages
    await loadMessages(user);

    // Configurer le défilement infini
    setupInfiniteScroll(user);
  };

  // Charger les messages à l'ouverture
  await initConversation(user);

  // 📌 Fonction d'envoi de message
  const sendMessage = async () => {
    const messageText = inputField.value.trim();
    if (messageText === "") {
      console.log("⚠️ Message vide, envoi annulé.");
      return;
    }

    console.log("📩 Envoi du message :", messageText);

    // Création de la date pour le message envoyé
    const now = new Date();
    const formattedTime = now
        .toLocaleString("fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(",", "");

    // Ajout immédiat du message côté client
    const messageElement = document.createElement("p");
    messageElement.classList.add("chat-message", "sent");
    messageElement.innerHTML = `${messageText} <br><small class="chat-time">${formattedTime}</small>`;
    chatBody.appendChild(messageElement);

    // Vider l'input et scroller en bas
    inputField.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Envoyer le message au serveur
    try {
      const response = await fetch("http://localhost:8080/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver: user, message: messageText }),
      });

      console.log("📡 Réponse POST reçue :", response.status);
      if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

      // Après un envoi réussi, réinitialiser la conversation pour afficher le nouveau message
      allMessages = []; // Vider le cache pour forcer un rechargement
      await refreshConversations();

      const messageTrailing = JSON.stringify({ type: "is_not_typing", content: user });
      socket.send(messageTrailing);
      isTypingSent = false;

      console.log(
          "✅ Message envoyé avec succès et conversations rafraîchies !"
      );
    } catch (error) {
      console.error("❌ Erreur d'envoi du message :", error);
    }
  };

  let isTypingSent = false;

  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  function sendMessageLeading() {
    if (!isTypingSent) {
      const messageLeading = JSON.stringify({ type: "is_typing", content: user });
      socket.send(messageLeading);
      isTypingSent = true;
    }
  }

  // Envoie du message "typing_end" après une pause d'inactivité
  const sendMessageTrailing = debounce(() => {
    const messageTrailing = JSON.stringify({ type: "is_not_typing", content: user });
    socket.send(messageTrailing);
    isTypingSent = false;
  }, 1000);

  // Gestion de l'input avec "change"
  inputField.addEventListener("input", () => {
    sendMessageLeading();  // Envoi immédiat
    sendMessageTrailing(); // Envoi après 1s d'inactivité
  });

  sendButton.addEventListener("click", sendMessage);

  inputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
      const messageTrailing = JSON.stringify({ type: "is_not_typing", content: user });
      socket.send(messageTrailing);
      isTypingSent = false;
    }
  });
};

/**
 * CSS injecté
 */
const style = document.createElement("style");
style.innerHTML = `
  /* 🌟 MODAL PRINCIPALE */
  .chat-modal {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    background: #1E1E1E;
    color: white;
    border-radius: 12px;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
    font-family: Arial, sans-serif;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.3s ease-out;
    z-index: 1000;
  }

  /* 🌟 ANIMATION */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 🌟 HEADER DE LA MODAL */
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #292929;
    font-weight: bold;
    border-bottom: 1px solid #3A3A3A;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  
  .chat-end-marker {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin: 10px 0;
    padding: 5px;
    border-radius: 10px;
    background-color: rgba(100, 100, 100, 0.1);
  }

  .chat-close {
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;
  }

  .chat-close:hover {
    transform: scale(1.1);
  }

  .chat-close svg {
    width: 22px;
    height: 22px;
  }

  /* 🌟 BODY (MESSAGES) */
  .chat-body {
    height: 250px;
    overflow-y: auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    background: #1E1E1E;
  }

  /* 🌟 MESSAGE */
  .chat-message {
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 8px;
    max-width: 75%;
    word-wrap: break-word;
    font-size: 14px;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
  }

  /* 🌟 MESSAGE REÇU */
  .received {
    align-self: flex-start;
    background: #303030;
    color: #EAEAEA;
  }

  /* 🌟 MESSAGE ENVOYÉ */
  .sent {
    align-self: flex-end;
    background: #0084FF;
    color: white;
  }

  /* 🌟 FOOTER (ZONE D'INPUT) */
  .chat-footer {
    display: flex;
    padding: 12px;
    background: #292929;
    border-top: 1px solid #3A3A3A;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  /* 🌟 INPUT */
  #chat-input {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    background: #3A3A3A;
    color: white;
  }

  /* 🌟 BOUTON ENVOYER */
  #chat-send {
    background: #0084FF;
    color: white;
    border: none;
    padding: 10px 14px;
    cursor: pointer;
    border-radius: 6px;
    margin-left: 8px;
    font-weight: bold;
    transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
  }

  #chat-send:hover {
    background: #006EDC;
    transform: scale(1.1);
  }

  /* 🌟 SCROLLBAR MODERNE */
  .chat-body::-webkit-scrollbar {
    width: 6px;
  }

  .chat-body::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 6px;
  }
`;
document.head.appendChild(style);
console.log("✅ Styles appliqués.");