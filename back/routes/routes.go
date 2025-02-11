package routes

import (
	"net/http"
	"real-time-forum/handlers"
)

func SetupRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/login", handlers.Login)
}
