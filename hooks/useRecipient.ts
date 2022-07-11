import { collection, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import { AppUser, Conversation } from '../types';
import { getRecipientEmail } from '../utils/getRecipientEmail';

export const useRecipient = (conversationUsers: Conversation['users']) => {
  const [loggedInUser, __loading, __error] = useAuthState(auth);
  // get recipientEmail
  const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);

  // get recipient avatar
  const queryGetRecipient = query(
    collection(db, 'users'),
    where('email', '==', recipientEmail)
  );

  const [recipientsSnapshot, _loading, _error] =
    useCollection(queryGetRecipient);

  // check recipientSnapshot is undefined or not
  const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined;

  console.log(recipient, ' check recipient');

  return { recipient, recipientEmail };
};
