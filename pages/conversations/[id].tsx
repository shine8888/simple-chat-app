import { deleteDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import ConversationScreen from '../../components/ConversationScreen';
import SideBar from '../../components/SideBar';
import { auth, db } from '../../firebase';
import { AppMessage, Conversation } from '../../types';
import {
  generateQueryMessage,
  transformMessage,
} from '../../utils/getMessagesFromConversation';
import { getRecipientEmail } from '../../utils/getRecipientEmail';

interface Props {
  conversation: Conversation;
  messages: AppMessage[];
}
const StyledWrapper = styled.div`
  display: flex;
`;

const StyledConversation = styled.div`
  flex-grow: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Conversation = ({ conversation, messages }: Props) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  return (
    <StyledWrapper>
      <Head>
        <title>
          Conversation with{' '}
          {getRecipientEmail(conversation.users, loggedInUser)}
        </title>
      </Head>
      <SideBar />
      <StyledConversation>
        <ConversationScreen conversation={conversation} messages={messages} />
      </StyledConversation>
    </StyledWrapper>
  );
};

export default Conversation;

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  const conversationId = context.params?.id;

  // Get conversation
  const conversationRef = doc(db, 'conversations', conversationId as string);
  const conversationSnapshot = await getDoc(conversationRef);

  // get all messages between current user and recipient

  const queryMessage = generateQueryMessage(conversationId);
  const messagesSnap = await getDocs(queryMessage);

  const messages = messagesSnap.docs.map((mes) =>
    transformMessage(mes)
  ) as AppMessage[];

  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages,
    },
  };
};
