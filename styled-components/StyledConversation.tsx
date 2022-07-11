import styled from 'styled-components';

export const StyledConversationWrapper = styled.div`
  display: flex;
`;

export const StyledConversation = styled.div`
  flex-grow: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;
