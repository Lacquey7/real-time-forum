package websocket

import (
	"database/sql"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

func NewUpgrader(db *sql.DB) websocket.Upgrader {
	return websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			// Récupère le cookie de session
			cookie, err := r.Cookie("session_id")
			if err != nil {
				log.Println("Aucun cookie session_id trouvé")
				return false // Rejeter la connexion si pas de session
			}

			// Vérifie si la session est valide
			if !isValidSession(db, cookie.Value) {
				log.Println("Session invalide:", cookie.Value)
				return false // Rejeter la connexion si session non valide
			}

			log.Println("Connexion WebSocket acceptée pour session :", cookie.Value)
			// Dans la fonction CheckOrigin
			log.Printf("Headers reçus: %+v\n", r.Header)
			log.Printf("Cookies reçus: %+v\n", r.Cookies())
			return true // Accepter la connexion
		},
	}
}

type Message struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

func (h *Hub) HandleConnections(w http.ResponseWriter, r *http.Request) {
	upgrader := NewUpgrader(h.DB) // Crée un Upgrader avec accès à la DB
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Erreur WebSocket:", err)
		return
	}
	// Ajout du client au hub
	h.register <- conn

	defer func() {
		h.unregister <- conn
	}()

	log.Println("✅ Nouveau client WebSocket connecté")

	// Lecture des messages envoyés par le client
	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			log.Println("Erreur WebSocket lecture:", err)
			break
		}
		log.Printf("📩 Message reçu : %s\n", msg.Content)

		h.broadcast <- msg
	}
}
