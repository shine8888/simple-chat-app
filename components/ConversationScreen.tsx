import IconButton from '@mui/material/IconButton';
import styled from 'styled-components';
import { useRecipient } from '../hooks/useRecipient';
import { Conversation, AppMessage } from '../types';
import {
  converFirestoreTimestampToString,
  generateQueryMessage,
  transformMessage,
} from '../utils/getMessagesFromConversation';
import RecipientAvatar from './RecipientAvatar';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useRef,
  useState,
} from 'react';
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

const ConversationScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: AppMessage[];
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const conversationUsers = conversation.users;

  const { recipientEmail, recipient } = useRecipient(conversationUsers);

  const router = useRouter();

  const conversationId = router.query.id as string;

  const queryMessage = generateQueryMessage(conversationId);
  const [messagesSnap, messagesLoading, __error] = useCollection(queryMessage);

  const addMessageToFireBase = async () => {
    try {
      await setDoc(
        doc(db, 'users', loggedInUser?.uid as string),
        {
          lastSeen: serverTimestamp(),
        },
        { merge: true } // Update only lastseen field
      );
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

  const sendMessageWhenEnter: KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!newMessage) return;
      addMessageToFireBase();
    }
  };

  const sendNewMessageByClick: MouseEventHandler<SVGSVGElement> = (event) => {
    event.preventDefault();
    if (!newMessage) return;
    addMessageToFireBase();
  };

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

  const endOfListMessage = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfListMessage.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onDeleteConversation = async () => {
    await deleteDoc(doc(db, 'conversations', conversationId as string));
    router.replace('/');
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
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon onClick={() => setOpenDialog(true)} />
          </IconButton>
        </StyledHeaderIcon>
      </StyledRecipientHeader>
      <StyledMessageContainer>
        {showMessages()}
        {/* auto scroll to lastest message*/}
        <StyledAutoScrollComponent ref={endOfListMessage} />
      </StyledMessageContainer>
      <StyledInputContainer>
        <InsertEmoticonIcon />
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
        <div>
          <input type="file" name="file" />
        </div>
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
