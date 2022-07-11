import IconButton from '@mui/material/IconButton';
import { useRecipient } from '../hooks/useRecipient';
import { Conversation, AppMessage } from '../types';
import {
  converFirestoreTimestampToString,
  generateQueryMessage,
  transformMessage,
} from '../utils/getMessagesFromConversation';
import RecipientAvatar from './RecipientAvatar';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import ClearIcon from '@mui/icons-material/Clear';
import { KeyboardEventHandler, useRef, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import Message from './Message';
import {
  StyledAutoScrollComponent,
  StyledH3,
  StyledHeaderIcon,
  StyledHeaderInfor,
  StyledInput,
  StyledInputContainer,
  StyledMessageContainer,
  StyledRecipientHeader,
} from '../styled-components/StyledConversationScreen';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import Tooltip from '@mui/material/Tooltip';
import EmojisContainer from './Emojis';

const ConversationScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: AppMessage[];
}) => {
  //Use State
  const [newMessage, setNewMessage] = useState('');
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [isShowPickingEmoji, setShowPickingEmoji] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  // useAuthState to get loggedUser
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const conversationUsers = conversation.users;

  // Hooks useRecipient to get recipient and recipientEmail
  const { recipientEmail, recipient } = useRecipient(conversationUsers);

  // Use Router to get conversationId
  const router = useRouter();
  const conversationId = router.query.id as string;

  // Generate query message and get all the message
  const queryMessage = generateQueryMessage(conversationId);
  const [messagesSnap, messagesLoading, __error] = useCollection(queryMessage);

  // USAGE FUNCTIONS
  // Insert message to firebase
  const addMessageToFireBase = async () => {
    try {
      // Update last seen to user
      await setDoc(
        doc(db, 'users', loggedInUser?.uid as string),
        {
          lastSeen: serverTimestamp(),
        },
        { merge: true } // Update only lastseen field
      );
      // Add message to messages collection
      await addDoc(collection(db, 'messages'), {
        conversation_id: conversationId,
        sent_at: serverTimestamp(),
        text: newMessage,
        user: loggedInUser?.email,
      });
      setNewMessage('');

      // Scroll to bottom
      scrollToBottom();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // Functions send message with enter and click
  const sendMessageWhenEnter: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === 'Enter') {
      sendNewMessageByClick(event);
    }
  };

  const sendNewMessageByClick = (event: any) => {
    event.preventDefault();
    if (!newMessage) return;
    addMessageToFireBase();
  };

  // Function load messages
  const showMessages = () => {
    // When front-end loading messages, display the messages that passing from SSR
    if (messagesLoading) {
      return messages.map((m) => <Message key={m.id} message={m} />);
    }
    // When front-end finished the loading message, display all news messages
    if (messagesSnap) {
      return messagesSnap.docs.map((m) => (
        <Message key={m.id} message={transformMessage(m)} />
      ));
    }
  };

  // Function delete conversation
  const onDeleteConversation = async () => {
    await deleteDoc(doc(db, 'conversations', conversationId as string));
    router.replace('/');
  };

  const endOfListMessage = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Scroll message to bottom
  const scrollToBottom = () => {
    endOfListMessage.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // TODO
  const onEmojiClick = (e: any, emojiObject: any) => {
    // const { emoji } = emojiObject;
    setEmoji(emojiObject);
    setNewMessage(newMessage + emojiObject);
  };

  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
        <StyledHeaderInfor>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              Last seen: {converFirestoreTimestampToString(recipient.lastSeen)}
            </span>
          )}
        </StyledHeaderInfor>
        <StyledHeaderIcon>
          <IconButton>
            <Tooltip title="Delete conversation">
              <ClearIcon onClick={() => setOpenDialog(true)} />
            </Tooltip>
          </IconButton>
        </StyledHeaderIcon>
      </StyledRecipientHeader>
      <StyledMessageContainer>
        {showMessages()}
        {/* auto scroll to lastest message*/}
        <StyledAutoScrollComponent ref={endOfListMessage} />
      </StyledMessageContainer>
      <StyledInputContainer>
        <StyledInput
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={sendMessageWhenEnter}
        />
        <IconButton>
          <SendIcon onClick={sendNewMessageByClick} />
        </IconButton>
        <IconButton>
          <MicIcon />
        </IconButton>
      </StyledInputContainer>

      <Dialog open={isOpenDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to delete this conversation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={onDeleteConversation}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConversationScreen;
