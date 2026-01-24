import {Client, type IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class NotificationService {
    private stompClient: Client | null = null;
    private readonly websocketEndpoint: string = 'http://localhost:8080/ws';
    private onConnectCallback: (() => void) | null = null;

    constructor() {
        this.stompClient = new Client({
            brokerURL: '_', // SockJS overrides this
            reconnectDelay: 5000,
            heartbeatIncoming: 10000, // Increased to reduce overhead if network is slow
            heartbeatOutgoing: 10000,
            // debug: (str) => { console.log(str); }, // Uncomment for debugging
            onConnect: () => {
                if (this.onConnectCallback) {
                    this.onConnectCallback();
                }
            },
            onDisconnect: () => {
                this.onConnectCallback = null;
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            webSocketFactory: () => new SockJS(this.websocketEndpoint),
        });
    }

    public connect(onConnect?: () => void): void {
        if (onConnect) {
            this.onConnectCallback = onConnect;
        }
        if (this.stompClient && !this.stompClient.active) {
            this.stompClient.activate();
        } else if (this.stompClient && this.stompClient.connected && onConnect) {
            // If already connected, trigger callback immediately
            onConnect();
        }
    }

    public disconnect(): void {
        if (this.stompClient && this.stompClient.active) {
            this.stompClient.deactivate();
        }
        this.onConnectCallback = null;
    }

    public subscribeToAutoSave(codigoProduccion: string, callback: (message: any) => void): () => void {
        const destination = `/topic/produccion/${codigoProduccion}`;
        if (this.stompClient && this.stompClient.connected) {
            const subscription = this.stompClient.subscribe(destination, (message: IMessage) => {
                callback(JSON.parse(message.body));
            });
            return () => subscription.unsubscribe();
        }
        console.warn('Attempted to subscribe before WebSocket connection was active.');
        return () => {
        };
    }

    public subscribeToProductionCreated(callback: (message: any) => void): () => void {
        const destination = `/topic/produccion/created`;
        if (this.stompClient && this.stompClient.connected) {
            const subscription = this.stompClient.subscribe(destination, (message: IMessage) => {
                callback(JSON.parse(message.body));
            });
            return () => subscription.unsubscribe();
        }
        console.warn('Attempted to subscribe to production created events before WebSocket connection was active.');
        return () => {
        };
    }

    public subscribeToProductionStateChanges(callback: (message: any) => void): () => void {
        const destination = `/topic/producciones/state-changed`;
        if (this.stompClient && this.stompClient.connected) {
            const subscription = this.stompClient.subscribe(destination, (message: IMessage) => {
                callback(JSON.parse(message.body));
            });
            return () => subscription.unsubscribe();
        }
        console.warn('Attempted to subscribe to global production state changes before WebSocket connection was active.');
        return () => {
        };
    }

    public subscribeToProduccionFinalizada(callback: (message: any) => void): () => void {
        const destination = `/topic/produccion/finished`;
        if (this.stompClient && this.stompClient.connected) {
            const subscription = this.stompClient.subscribe(destination, (message: IMessage) => {
                callback(JSON.parse(message.body));
            });
            return () => subscription.unsubscribe();
        }
        console.warn('Attempted to subscribe before WebSocket connection was active.');
        return () => {
        };
    }

    public subscribeToProduccionCancelada(callback: (message: any) => void): () => void {
        const destination = `/topic/produccion/cancelled`;
        if (this.stompClient && this.stompClient.connected) {
            const subscription = this.stompClient.subscribe(destination, (message: IMessage) => {
                callback(JSON.parse(message.body));
            });
            return () => subscription.unsubscribe();
        }
        console.warn('Attempted to subscribe before WebSocket connection was active.');
        return () => {
        };
    }
}

export const notificationService = new NotificationService();
