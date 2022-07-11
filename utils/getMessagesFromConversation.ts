import {
  collection,
  DocumentData,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AppMessage } from '../types';

export const generateQueryMessage = (conversationId?: string) =>
  query(
    collection(db, 'messages'),
    where('conversation_id', '==', conversationId),
    orderBy('sent_at', 'asc')
  );

export const converFirestoreTimestampToString = (timestamp: Timestamp) =>
  new Date(timestamp.toDate().getTime()).toLocaleString();

export const transformMessage = (
  message: QueryDocumentSnapshot<DocumentData>
) =>
  ({
    id: message.id,
    ...message.data(),
    sent_at: message.data().sent_at
      ? converFirestoreTimestampToString(message.data().sent_at as Timestamp)
      : null,
  } as AppMessage);
