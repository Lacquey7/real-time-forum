import { createMessageElement } from "../messageModal/messageGenerique.js";
import { messageModal } from "../messageModal/messageModal.js";

export const bodyHtml = () => {
  // Création de l'élément <main>
  const main = document.createElement("main");
  main.classList.add("main-container");

  // Fonction pour créer une section sticky avec un contenu scrollable
  const createStickySection = (titleText, id = "") => {
    const section = document.createElement("div");
    section.classList.add("section");

    // Titre sticky
    const title = document.createElement("h3");
    title.classList.add("section-title");
    title.innerText = titleText;

    // Contenu scrollable
    const content = document.createElement("div");
    content.classList.add(`section-content`);
    content.id = `${id}`;

    section.appendChild(title);
    section.appendChild(content);
    return { section, content };
  };

  // Colonne gauche : Utilisateurs connectés
  const { section: usersContainer } = createStickySection(
    "Utilisateurs connectés"
  );
  usersContainer.classList.add("users-container");

  // Section centrale : Posts
  const { section: postsContainer, content: postsContent } =
    createStickySection("Publications");
  postsContainer.classList.add("posts-container");

  // Récupérer et afficher les posts
  const fetchPosts = async () => {
    try {
      const posts = await getAllPost();

      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        // Titre du post (Auteur + Catégorie et date)
        const postHeader = document.createElement("div");
        postHeader.classList.add("post-header");

        const postAuthor = document.createElement("strong");
        postAuthor.innerText = `${post.username} - ${post.category}`;

        const postDate = document.createElement("small");
        postDate.innerText = new Date(post.created_at).toLocaleString();
        postDate.classList.add("post-date");

        postHeader.appendChild(postAuthor);
        postHeader.appendChild(postDate);

        // Contenu du post
        const postContent = document.createElement("p");
        postContent.innerText = post.content;
        postContent.classList.add("post-content");

        // Section des interactions (likes/dislikes)
        const postInteractions = document.createElement("div");
        postInteractions.classList.add("post-interactions");

        const likeBtn = document.createElement("button");
        likeBtn.classList.add("post-button", "like");
        if (post.liked) {
          likeBtn.classList.add("liked");
        }
        likeBtn.innerHTML = svgLike + `<span>${post.likes}</span>`;

        const dislikeBtn = document.createElement("button");
        dislikeBtn.classList.add("post-button", "dislike");
        if (post.disliked) {
          dislikeBtn.classList.add("disliked");
        }
        dislikeBtn.innerHTML = svgDislike + `<span>${post.dislikes}</span>`;

        likeBtn.addEventListener("click", async () => {
          try {
            const isLiked = likeBtn.classList.contains("liked");
            const isDisliked = dislikeBtn.classList.contains("disliked");

            await fetch("http://localhost:8080/event", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "post",
                content_type: "like",
                id: post.id,
              }),
            });

            let likeCount = parseInt(
              likeBtn.querySelector("span").innerText,
              10
            );
            let dislikeCount = parseInt(
              dislikeBtn.querySelector("span").innerText,
              10
            );

            if (isLiked) {
              //Si déjà liké → annuler le like
              likeCount -= 1;
              likeBtn.classList.remove("liked");
            } else {
              //Ajouter un like
              likeCount += 1;
              likeBtn.classList.add("liked");

              if (isDisliked) {
                //Si déjà disliké → annuler le dislike
                dislikeCount -= 1;
                dislikeBtn.classList.remove("disliked");
              }
            }

            //Mettre à jour les compteurs
            likeBtn.querySelector("span").innerText = likeCount;
            dislikeBtn.querySelector("span").innerText = dislikeCount;
          } catch (e) {
            console.error("Erreur lors de l'envoi du like:", e.message);
          }
        });

        dislikeBtn.addEventListener("click", async () => {
          try {
            const isLiked = likeBtn.classList.contains("liked");
            const isDisliked = dislikeBtn.classList.contains("disliked");

            await fetch("http://localhost:8080/event", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                type: "post",
                content_type: "dislike",
                id: post.id,
              }),
            });

            let likeCount = parseInt(
              likeBtn.querySelector("span").innerText,
              10
            );
            let dislikeCount = parseInt(
              dislikeBtn.querySelector("span").innerText,
              10
            );

            if (isDisliked) {
              // Si déjà disliké → annuler le dislike
              dislikeCount -= 1;
              dislikeBtn.classList.remove("disliked");
            } else {
              //Ajouter un dislike
              dislikeCount += 1;
              dislikeBtn.classList.add("disliked");

              if (isLiked) {
                //Si déjà liké → annuler le like
                likeCount -= 1;
                likeBtn.classList.remove("liked");
              }
            }
            //Mettre à jour les compteurs
            likeBtn.querySelector("span").innerText = likeCount;
            dislikeBtn.querySelector("span").innerText = dislikeCount;
          } catch (e) {
            console.error("Erreur lors de l'envoi du dislike:", e.message);
          }
        });

        postInteractions.appendChild(likeBtn);
        postInteractions.appendChild(dislikeBtn);

        // Section des commentaires avec l'icône correspondante
        const commentsSection = document.createElement("div");
        commentsSection.classList.add("comment-section");

        // Titre "Commentaires (X)"
        const commentTitle = document.createElement("strong");
        commentTitle.classList.add("comment-title");
        commentTitle.innerHTML = svgComment + ` Commentaires`;
        commentTitle.style.cursor = "pointer";
        commentTitle.style.color = "#000000"; // Bleu Twitter

        // Conteneur pour afficher les commentaires
        const commentsContainer = document.createElement("div");
        commentsContainer.classList.add("comments-container");
        commentsContainer.style.display = "none"; // Masqué au début

        // Formulaire d'ajout de commentaire
        const commentForm = document.createElement("form");
        commentForm.classList.add("comment-form");
        commentForm.style.display = "none"; // Masqué tant que l'utilisateur n'a pas ouvert les commentaires

        // Champ pour saisir le contenu du commentaire
        const commentInput = document.createElement("input");
        commentInput.type = "text";
        commentInput.placeholder = "Écrire un commentaire...";
        commentInput.required = true;

        // Bouton d'envoi
        const commentSubmitBtn = document.createElement("button");
        commentSubmitBtn.type = "submit";
        commentSubmitBtn.innerText = "Envoyer";

        // Ajout des éléments au formulaire
        commentForm.appendChild(commentInput);
        commentForm.appendChild(commentSubmitBtn);

        // Événement de soumission du formulaire
        commentForm.addEventListener("submit", async (e) => {
          e.preventDefault();
          const content = commentInput.value.trim();
          if (!content) return;
          // Envoyer le commentaire au serveur
          await sendComment(post.id, content);

          // Recharger les commentaires depuis l'API
          commentsContainer.innerHTML = "";
          const newComments = await fetchComments(post.id);
          if (newComments.length > 0) {
            newComments.forEach((comment) => {
              const commentElement = makeCommentElement(comment);
              commentsContainer.appendChild(commentElement);
            });
          } else {
            commentsContainer.innerText = "Aucun commentaire.";
          }

          // Vider le champ texte
          commentInput.value = "";
        });

        // Ajouter un événement "click" sur le titre pour afficher/masquer les commentaires
        commentTitle.addEventListener("click", async () => {
          // Si le conteneur est vide, on va chercher les commentaires
          if (commentsContainer.childNodes.length === 0) {
            const comments = await fetchComments(post.id);
            if (comments.length > 0) {
              comments.forEach((comment) => {
                const commentElement = makeCommentElement(comment);
                commentsContainer.appendChild(commentElement);
              });
            } else {
              commentsContainer.innerText = "Aucun commentaire.";
            }
          }

          // Toggle l'affichage
          const currentDisplay = commentsContainer.style.display;
          commentsContainer.style.display =
            currentDisplay === "none" ? "block" : "none";

          // Le formulaire est masqué ou affiché au même rythme que le conteneur
          commentForm.style.display = commentsContainer.style.display;
        });

        // Assemblage de la section commentaires
        commentsSection.appendChild(commentTitle);
        commentsSection.appendChild(commentForm);
        commentsSection.appendChild(commentsContainer);

        // Assemblage du post
        postElement.appendChild(postHeader);
        postElement.appendChild(postContent);
        postElement.appendChild(postInteractions);
        postElement.appendChild(commentsSection);

        postsContent.appendChild(postElement);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des posts:", error.message);
    }
  };

  fetchPosts();

  // Colonne droite : Messages envoyés
  const { section: messagesContainer, content: messagesContent } =
    createStickySection("Messages", "messages-id");
  messagesContainer.classList.add("messages-container");

  // Appliquer les styles pour les conversations
  const initMessageStyles = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      .conversation {
          display: flex;
          flex-direction: column;
          padding: 12px;
          border-bottom: 1px solid #444;
          background: #000000FF;
          color: white;
          transition: background 0.3s;
          border-radius: 10px;
          margin-bottom: 10px;
          cursor: pointer;
      }

      .conversation:hover {
          background: #3a3b3c;
      }

      .conversation-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
      }

      .last-message {
          font-size: 14px;
          color: #b0b3b8;
          margin-bottom: 4px;
      }

      .message-date {
          font-size: 12px;
          color: #b0b3b8;
          align-self: flex-end;
      }
          .empty-conversations, .error-message {
    padding: 20px;
    text-align: center;
    color: #b0b3b8;
    background: #000000FF;
    border-radius: 10px;
    margin: 10px;
}

.empty-conversations p {
    margin: 5px 0;
}

.error-message {
    color: #ff6b6b;
}
    `;
    document.head.appendChild(style);
  };

  // Initialiser les styles et charger les messages
  initMessageStyles();
  refreshConversations();

  // Assemblage des colonnes
  main.appendChild(usersContainer);
  main.appendChild(postsContainer);
  main.appendChild(messagesContainer);

  const divApp = document.querySelector("#app");
  divApp.appendChild(main);
};

// Fonction pour obtenir les messages depuis l'API
export const messages = async () => {
  try {
    const response = await fetch("http://localhost:8080/conversation");

    if (!response.ok) {
      throw new Error(
        `Erreur HTTP: ${response.status} - ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(
      "Erreur lors du chargement des conversations:",
      error.message
    );
    return []; // Retourne un tableau vide en cas d'erreur pour éviter les crashs
  }
};

// Fonction pour rafraîchir et trier toutes les conversations
export const refreshConversations = async () => {
  const sectionContent = document.querySelector("#messages-id");
  if (!sectionContent) return;

  try {
    // Récupérer toutes les conversations
    const conversations = await messages();

    // Vider le conteneur
    sectionContent.innerHTML = "";

    // Si pas de conversations, afficher un message d'attente et quitter
    if (
      !conversations ||
      !Array.isArray(conversations) ||
      conversations.length === 0
    ) {
      const emptyMessage = document.createElement("div");
      emptyMessage.classList.add("empty-conversations");
      emptyMessage.innerHTML = `
          <p>Aucune conversation pour le moment.</p>
          <p>Cliquez sur un utilisateur connecté pour démarrer une discussion.</p>
        `;
      sectionContent.appendChild(emptyMessage);
      return;
    }

    // Extraire les dates des derniers messages pour chaque conversation
    const conversationsWithDates = conversations.map((conv) => {
      return {
        ...conv,
        timestamp: new Date(conv.last_message_date).getTime(),
      };
    });

    // Trier par timestamp décroissant (plus récent en premier)
    conversationsWithDates.sort((a, b) => b.timestamp - a.timestamp);

    // Recréer les éléments dans le bon ordre
    conversationsWithDates.forEach((conv) => {
      const msgElement = createMessageElement(conv, messageModal);
      sectionContent.appendChild(msgElement);
    });

    console.log("📊 Conversations triées par date du dernier message");
  } catch (error) {
    console.error("❌ Erreur lors du tri des conversations:", error);

    // En cas d'erreur, afficher un message
    sectionContent.innerHTML = `
        <div class="error-message">
          <p>Impossible de charger les conversations.</p>
        </div>
      `;
  }
};

// Récupère tous les posts depuis l'API
const getAllPost = async () => {
  try {
    const response = await fetch("http://localhost:8080/post", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (e) {
    throw new Error(`Erreur lors de la récupération des posts: ${e.message}`);
  }
};

// Récupère les commentaires d'un post
const fetchComments = async (postId) => {
  try {
    const response = await fetch(`http://localhost:8080/comment/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    let comments = await response.json(); // ✅ Récupérer les commentaires

    // ✅ Trier les commentaires par date du plus récent au plus ancien
    comments.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return comments; // Retourne les commentaires triés
  } catch (e) {
    console.error(
      `Erreur lors de la récupération des commentaires: ${e.message}`
    );
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// Envoie un nouveau commentaire pour un post donné
const sendComment = async (postId, content) => {
  try {
    const response = await fetch("http://localhost:8080/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_post: postId,
        content: content,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    // Pas besoin de renvoyer la data, on re-fetch après
  } catch (e) {
    console.error(`Erreur lors de l'envoi du commentaire: ${e.message}`);
  }
};

// Crée un élément DOM pour un commentaire (affiche toutes les infos)
const makeCommentElement = (comment) => {
  const commentWrapper = document.createElement("div");
  commentWrapper.classList.add("comment");

  //Création de l'en-tête du commentaire (Utilisateur + Date)
  const commentHeader = document.createElement("div");
  commentHeader.classList.add("comment-header");

  const userInfo = document.createElement("strong");
  userInfo.classList.add("comment-username");
  userInfo.innerText = comment.username;

  const commentDate = document.createElement("small");
  commentDate.classList.add("comment-date");
  commentDate.innerText = new Date(comment.created_at).toLocaleString();

  commentHeader.appendChild(userInfo);
  commentHeader.appendChild(commentDate);

  // Contenu du commentaire
  const contentInfo = document.createElement("p");
  contentInfo.classList.add("comment-content");
  contentInfo.innerText = comment.content;

  //Boutons d'interactions (Like/Dislike)
  const commentActions = document.createElement("div");
  commentActions.classList.add("comment-actions");

  // Assemblage final du commentaire
  commentWrapper.appendChild(commentHeader);
  commentWrapper.appendChild(contentInfo);
  commentWrapper.appendChild(commentActions);

  return commentWrapper;
};

// Définition des SVG pour les icônes
const svgLike = `<svg class="icon" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24" width="16" height="16">
      <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32
      c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9
      c0 1.1.9 2 2 2h9c.78 0 1.45-.45 1.75-1.11l3.58-7.16
      c.08-.14.12-.3.12-.44v-2z"/>
    </svg>`;

const svgDislike = `<svg class="icon" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24" width="16" height="16">
      <path d="M23 3h-4v12h4V3zM1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32
      c0 .41.17.79.44 1.06L9.83 22l6.58-6.59C16.78 14.05 17 13.55
      17 13V4c0-1.1-.9-2-2-2H3c-.78 0-1.45.45-1.75 1.11L.67 8.27
      c-.08.14-.12.3-.12.44v2z"/>
    </svg>`;

const svgComment = `<svg class="icon" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24" width="16" height="16">
      <path d="M21 6h-2v9H5v2c0 .55.45 1 1 1h11l4 4V7
      c0-.55-.45-1-1-1zM17 2H3c-.55 0-1 .45-1 1v14l4-4h11
      c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1z"/>
    </svg>`;
