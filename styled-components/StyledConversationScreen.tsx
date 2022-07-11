import styled from 'styled-components';

export const StyledRecipientHeader = styled.div`
  display: flex;
  position: sticky;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid #f5f5f5;
  top: 0;
  z-index: 1;
  align-items: center;
  background-color: #fff;
`;

export const StyledH3 = styled.h3`
  word-break: break-all;
`;

export const StyledHeaderInfor = styled.div`
  flex-grow: 1;
  > span {
    font-size: 14px;
    color: #808080;
  }

  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }
`;

export const StyledHeaderIcon = styled.div`
  display: flex;
`;

export const StyledMessageContainer = styled.div`
  background-color: #e5efe8;
  padding: 30px;
  min-height: 90vh;
`;

export const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  bottom: 0;
  z-index: 100;
  position: sticky;
  background-color: #fff;
`;

export const StyledInput = styled.input`
  outline: none;
  border: none;
  margin-left: 15px;
  flex-grow: 1;
  margin-right: 15px;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 15px;
`;

export const StyledAutoScrollComponent = styled.div`
  margin-bottom: 15px;
`;
