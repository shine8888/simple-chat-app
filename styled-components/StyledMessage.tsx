import styled from 'styled-components';

const StyledMessage = styled.p`
  width: fit-content;
  max-width: 90%;
  min-width: 30%;
  margin: 10px;
  padding: 15px 30px;
  word-break: break-all;
  border-radius: 8px;
  position: relative;
`;

export const StyledSender = styled(StyledMessage)`
  background-color: #dcf8c6;
  margin-left: auto;
`;
export const StyledReceiver = styled(StyledMessage)`
  background-color: #f5f5f5;
`;

export const StyledTimestamp = styled.span`
  padding: 10px;
  bottom: 0;
  right: 0;
  font-size: x-small;
  position: absolute;
  color: #808080;
  text-align: right;
`;
