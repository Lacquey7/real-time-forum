package websocketFile

import (
	"database/sql"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"real-time-forum/models"
	"real-time-forum/utils"
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
			return true // Accepter la connexion
		},
	}
}

func (h *Hub) HandleConnections(db *sql.DB, w http.ResponseWriter, r *http.Request) {
	upgrader := NewUpgrader(h.DB) // Crée un Upgrader avec accès à la DB
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Erreur WebSocket:", err)
		return
	}

	cookie, err := r.Cookie("session_id")
	if err != nil {
		utils.SendErrorResponse(w, 401, "Missing Cookie")
		conn.Close()
		return
	}

	sessionID := cookie.Value

	username := utils.GetUsername(db, sessionID)

	// Ajout du client au hub
	h.clients[conn] = username

	h.broadcastNewUser(username)

	h.register <- conn

	defer func() {
		h.BroadcastDisconnectedUser(username)

		h.mu.Lock()
		delete(h.clients, conn)
		h.mu.Unlock()
		h.unregister <- conn
		conn.Close()
	}()

	log.Println("✅ Nouveau client WebSocket connecté")

	// Lecture des messages envoyés par le client
	for {
		var msg models.Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
				log.Println("🚨 Connexion WebSocket fermée de manière inattendue:", err)
			} else {
				log.Println("ℹ️ Connexion WebSocket fermée proprement.")
			}
			break
		}
		log.Printf("📩 Message reçu : %s\n", msg.Type)

		switch msg.Type {
		case "get_user":
			h.sendConnectedUsers(conn)
		default:
			// Par exemple, ajouter l'expéditeur au message et le diffuser
			msg.Sender = conn
			h.broadcast <- msg
		}
	}
}
