package websocket

import (
	"database/sql"
	"github.com/gorilla/websocket"
	"sync"
)

// Hub gère toutes les connexions WebSocket actives et la diffusion des messages.
type Hub struct {
	clients    map[*websocket.Conn]bool // Stocke les connexions WebSocket actives
	broadcast  chan interface{}         // Canal pour diffuser les messages à tous les clients
	register   chan *websocket.Conn     // Canal pour enregistrer une connexion
	unregister chan *websocket.Conn     // Canal pour supprimer une connexion
	mu         sync.Mutex               // Mutex pour éviter les conflits d'accès
	DB         *sql.DB                  // Connexion à la base de données pour vérifier la session
}

// NewHub crée un nouveau hub WebSocket.
func NewHub(db *sql.DB) *Hub {
	return &Hub{
		clients:    make(map[*websocket.Conn]bool),
		broadcast:  make(chan interface{}),
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
		DB:         db,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.Close()
			}
		case message := <-h.broadcast:
			h.mu.Lock()
			for client := range h.clients {
				err := client.WriteJSON(message)
				if err != nil {
					client.Close()
					delete(h.clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}
