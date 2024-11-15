export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen: Date;
  unreadCount?: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

