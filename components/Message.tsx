import { AppMessage } from '../types';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import {
  StyledTimestamp,
  StyledSender,
  StyledReceiver,
} from '../styled-components/StyledMessage';

const Message = ({ message }: { message: AppMessage }) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const MessageType =
    loggedInUser?.email === message.user ? StyledSender : StyledReceiver;

  return (
    <MessageType>
      {message.text}
      <StyledTimestamp>{message.sent_at}</StyledTimestamp>
    </MessageType>
  );
};

export default Message;
