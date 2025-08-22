// Minimal WebSocket client to sync with local debugging server.
// Sends snapshots and receives global snapshots (very simple protocol).
export default class NetworkClient {
  private socket?: WebSocket;
  private url: string;
  private reconnectMs = 2000;
  constructor(url = "ws://localhost:3001") {
    this.url = url;
  }
  connect() {
    if (this.socket) return;
    try {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        console.info("[Net] Connected to server", this.url);
      };
      this.socket.onmessage = (ev) => {
        // broadcast to game via event bus
        try {
          const payload = JSON.parse(ev.data);
          // simply emit raw
          (window as any).eventBus?.emit?.("network:message", payload);
        } catch (e) {
          console.warn("Invalid network message", e);
        }
      };
      this.socket.onclose = () => {
        console.info("[Net] Disconnected, retrying in", this.reconnectMs);
        this.socket = undefined;
        setTimeout(() => this.connect(), this.reconnectMs);
      };
      this.socket.onerror = (e) => {
        console.warn("[Net] error", e);
        this.socket?.close();
      };
    } catch (e) {
      console.warn("[Net] connect failed", e);
    }
  }
  send(obj: any) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    try {
      this.socket.send(JSON.stringify(obj));
    } catch (e) {
      console.warn("network send error", e);
    }
  }
}
