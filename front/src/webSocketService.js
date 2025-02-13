// webSocketService.js

class WebSocketService {
    constructor() {
        this.socket = null;
        this.messageHandlers = new Map();
        this.isConnected = false;
    }

    connect() {
        try {
            // Créer les options pour la connexion WebSocket
            const requestUrl = `ws://localhost:8080/ws`;


            // Créer la connexion avec les headers
            this.socket = new WebSocket(requestUrl);

            this.socket.onopen = () => {
                console.log('✅ WebSocket connecté avec succès');
                this.isConnected = true;
            };

            this.socket.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('Message reçu:', message);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('Erreur parsing message:', error);
                }
            };

            this.socket.onclose = (event) => {
                console.log('WebSocket déconnecté. Code:', event.code, 'Raison:', event.reason);
                this.isConnected = false;
            };

            this.socket.onerror = (error) => {
                console.error('Erreur WebSocket:', error);
            };

        } catch (error) {
            console.error('Erreur lors de la création du WebSocket:', error);
        }
    }

    handleMessage(message) {
        const handler = this.messageHandlers.get(message.type);
        if (handler) {
            handler(message);
        }
    }

    on(type, handler) {
        this.messageHandlers.set(type, handler);
    }

    send(type, content) {
        if (!this.isConnected) {
            console.warn('WebSocket non connecté. Message non envoyé:', { type, content });
            return;
        }

        try {
            const message = JSON.stringify({
                type: type,
                content: content
            });
            this.socket.send(message);
            console.log('Message envoyé:', message);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du message:', error);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// Export d'une instance unique
const wsService = new WebSocketService();
export default wsService;