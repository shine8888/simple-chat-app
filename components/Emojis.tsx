import {
  EmojisWrapper,
  EmojisPickerWrapper,
} from '../styled-components/StyledEmoji';

const EmojisContainer = ({ pickEmoji }: { pickEmoji: any }) => {
  return (
    <EmojisWrapper>
      <EmojisPickerWrapper onEmojiClick={pickEmoji} />
    </EmojisWrapper>
  );
};

export default EmojisContainer;
