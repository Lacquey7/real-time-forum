export default function createPost(postData) {
    // Récupérer le conteneur des posts
    const postContainer = document.getElementById("posts-container");

    if (!postContainer) {
        console.error("Le conteneur 'posts-container' est introuvable.");
        return;
    }

    // Créer un nouvel élément div pour le post
    const postElement = document.createElement("div");
    postElement.classList.add("post");

    // Ajouter le nom de l'utilisateur
    const usernameElement = document.createElement("h3");
    usernameElement.classList.add("post-username");
    usernameElement.textContent = postData.username;
    postElement.appendChild(usernameElement);

    // Ajouter la catégorie du post
    const categoryElement = document.createElement("span");
    categoryElement.classList.add("post-category");
    categoryElement.textContent = `#${postData.category}`;
    postElement.appendChild(categoryElement);

    // Formater la date du post
    const formattedDate = new Date(postData.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    // Ajouter la date du post
    const dateElement = document.createElement("p");
    dateElement.classList.add("post-date");
    dateElement.textContent = `Publié le ${formattedDate}`;
    postElement.appendChild(dateElement);

    // Ajouter le contenu du post
    const contentElement = document.createElement("p");
    contentElement.classList.add("post-content");
    contentElement.textContent = postData.content;
    postElement.appendChild(contentElement);


    // Créer un conteneur pour les interactions (likes, dislikes, commentaires)
    const interactionContainer = document.createElement("div");
    interactionContainer.classList.add("post-interactions");

    // Bouton Like
    const likeButton = document.createElement("button");
    likeButton.classList.add("like-btn");
    likeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="heart-icon">
        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
    </svg>
`;
    if (postData.liked) likeButton.classList.add("liked");
    likeButton.onclick = () => toggleLike(postData.id, likeButton);
    interactionContainer.appendChild(likeButton);

    // Bouton Dislike
    const dislikeButton = document.createElement("button");
    dislikeButton.classList.add("dislike-btn");
    dislikeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dislike-icon">
        <!-- Cœur principal -->
        <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z"/>
        <!-- Fissure stylisée en zigzag -->
        <path d="M10 5 L13 10 L11 13 L14 16" stroke="white" stroke-width="2" fill="none"/>
    </svg>
`;

    if (postData.disliked) dislikeButton.classList.add("disliked");

    dislikeButton.onclick = () => toggleDislike(postData.id, dislikeButton);
    interactionContainer.appendChild(dislikeButton);

// Bouton Commentaire avec SVG
    const commentButton = document.createElement("button");
    commentButton.classList.add("comment-btn");

// SVG d'une bulle de commentaire
    commentButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="comment-icon">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
`;

    interactionContainer.appendChild(commentButton);

    // Ajouter les boutons au post
    postElement.appendChild(interactionContainer);

    // Ajouter le post à la div `post-container`
    postContainer.appendChild(postElement);
}