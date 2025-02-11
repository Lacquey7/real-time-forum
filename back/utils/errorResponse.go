package utils

import (
	"encoding/json"
	"net/http"
)

type ErrorMessage struct {
	Code    int
	Message string
}

func SendErrorResponse(w http.ResponseWriter, code int, message string) {
	w.WriteHeader(code)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(ErrorMessage{
		Code:    code,
		Message: message,
	})
}
