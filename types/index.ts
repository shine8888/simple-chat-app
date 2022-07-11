import { Timestamp } from 'firebase/firestore';

export interface Conversation {
  users: [string];
}

export interface AppUser {
  email: string;
  lastSeen: Timestamp;
  photoUrl: string;
}

export interface AppMessage {
  id: string;
  conversation_id: string;
  text: string;
  sent_at: string | null;
  user: string;
}
