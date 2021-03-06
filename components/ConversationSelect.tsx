import { Conversation } from '../types';
import { useRecipient } from '../hooks/useRecipient';
import RecipientAvatar from './RecipientAvatar';
import { useRouter } from 'next/router';
import { StyledConversationSelectWrapper } from '../styled-components/StyledConversationSelect';

const ConversationSelect = ({
  id,
  conversationUsers,
}: {
  id: string;
  conversationUsers: Conversation['users'];
}) => {
  // Use router
  const router = useRouter();
  // Hooks useRecipient
  const { recipient, recipientEmail } = useRecipient(conversationUsers);

  // Function to change the route to exact conversation
  const onSelectConversation = () => {
    router.push(`/conversations/${id}`);
  };

  return (
    <StyledConversationSelectWrapper onClick={onSelectConversation}>
      <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
      <span>{recipientEmail}</span>
    </StyledConversationSelectWrapper>
  );
};

export default ConversationSelect;
