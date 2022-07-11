import { useRecipient } from '../hooks/useRecipient';
import { StyledAvatar } from '../styled-components/StyledRecipientAvatar';

type Props = ReturnType<typeof useRecipient>;

const RecipientAvatar = ({ recipient, recipientEmail }: Props) => {
  return recipient?.photoUrl ? (
    <StyledAvatar src={recipient.photoUrl} />
  ) : (
    <StyledAvatar>
      {recipientEmail && recipientEmail[0].toUpperCase()}
    </StyledAvatar>
  );
};

export default RecipientAvatar;
