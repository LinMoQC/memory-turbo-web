import { io, Socket } from "socket.io-client";

type WebSocketClientOptions = {
  maxReconnectTimes?: number; // 最大重连次数
  reconnectInterval?: number; // 重连间隔时间（毫秒）
  heartbeatInterval?: number; // 心跳间隔时间（毫秒）
  heartbeatData?: string; // 心跳数据
};

class WebSocketClient {
  private socket: Socket | null = null;
  private url: string;
  private maxReconnectTimes: number;
  private reconnectTimes: number = 0;
  private reconnectInterval: number;
  private isReconnecting: boolean = false;
  private heartbeatInterval: number;
  private heartbeatData: string;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private onMessageCallback: ((data: any) => void) | null = null;
  private onConnectCallback: (() => void) | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private onErrorCallback: ((err: any) => void) | null = null;

  constructor(url: string, options: WebSocketClientOptions = {}) {
    if (!url) {
      throw new Error("WebSocket server URL is required.");
    }
    this.url = url;
    this.maxReconnectTimes = options.maxReconnectTimes || 5;
    this.reconnectInterval = options.reconnectInterval || 3000;
    this.heartbeatInterval = options.heartbeatInterval || 30000;
    this.heartbeatData = options.heartbeatData || "ping";
  }

  // 初始化连接
  connect() {
    if (this.socket) {
      console.warn("WebSocket is already connected.");
      return;
    }

    this.socket = io(this.url, {
      autoConnect: false, // 不自动连接
      reconnection: false, // 手动管理重连
      withCredentials: true, 
    });

    this.socket.on("connect", () => {
      console.log(`Connected to WebSocket server at ${this.url}`);
      this.reconnectTimes = 0;
      this.startHeartbeat();
      if (this.onConnectCallback) this.onConnectCallback();
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      this.stopHeartbeat();
      if (this.onDisconnectCallback) this.onDisconnectCallback();
      if (this.reconnectTimes < this.maxReconnectTimes) {
        this.reconnect();
      }
    });

    this.socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
      if (this.onErrorCallback) this.onErrorCallback(err);
    });

    this.socket.connect(); 
  }

  private reconnect() {
    if (this.isReconnecting || this.reconnectTimes >= this.maxReconnectTimes) return;

    this.isReconnecting = true;
    this.reconnectTimes++;

    setTimeout(() => {
      console.log(`Attempting to reconnect... (${this.reconnectTimes})`);
      this.socket?.connect();
      this.isReconnecting = false;
    }, this.reconnectInterval);
  }

  // 发送消息
  sendMessage(event: string, message: any) {
    if (!this.socket || !this.socket.connected) {
      console.warn("WebSocket is not connected.");
      return;
    }
    this.socket.emit(event, message);
  }

  // 监听事件
  onMessage(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      console.warn("WebSocket is not connected.");
      return;
    }
    this.onMessageCallback = callback;
    this.socket.on(event, callback);
  }

  // 移除事件监听器
  offMessage(event: string, callback?: (data: any) => void) {
    if (!this.socket) {
      console.warn("WebSocket is not connected.");
      return;
    }
    this.socket.off(event, callback);
  }

  // 设置连接成功回调
  onConnect(callback: () => void) {
    this.onConnectCallback = callback;
  }

  // 设置断开连接回调
  onDisconnect(callback: () => void) {
    this.onDisconnectCallback = callback;
  }

  // 设置错误回调
  onError(callback: (err: any) => void) {
    this.onErrorCallback = callback;
  }

  // 启动心跳机制
  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.connected) {
        this.socket.emit("heartbeat", this.heartbeatData);
      }
    }, this.heartbeatInterval);
  }

  // 停止心跳机制
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("WebSocket connection closed.");
    }
  }
}

// 创建全局实例
const WS = new WebSocketClient(
  process.env.NEXT_PUBLIC_WS_BACKEN_ADDRESS || "http://localhost:5666/ws",
  {
    maxReconnectTimes: 5,
    reconnectInterval: 3000,
    heartbeatInterval: 30000,
    heartbeatData: "ping",
  }
);

export default WS;
