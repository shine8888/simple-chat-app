import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

export const StyledWrapper = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  border-right: 1px solid #f5f5f5;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  height: 80px;
  top: 0;
  border-bottom: 1px solid #f5f5f5;
  position: sticky;
  align-items: center;
  background-color: #fff;
  z-index: 1;
`;

export const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  border-radius: 2px;
  padding: 15px;
`;

export const StyledAvatarUser = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

export const StyledSearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
`;

export const StyledSideBarButton = styled(Button)`
  width: 100%;
  border-bottom: 1px solid #f5f5f5;
  border-top: 1px solid #f5f5f5;
`;
