import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import * as EmailValidator from 'email-validator';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection, query, where } from 'firebase/firestore';
import { Conversation } from '../types';
import ConversationSelect from './ConversationSelect';
import {
  StyledAvatarUser,
  StyledHeader,
  StyledSearch,
  StyledSearchInput,
  StyledWrapper,
} from '../styled-components/StyledSideBar';

const SideBar = () => {
  //USESTATE
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [findingEmailAddress, setFindingEmailAddress] = useState('');

  // Prepare query for get all conversations of logged user
  const getAllConversationEmailsQuery = query(
    collection(db, 'conversations'),
    where('users', 'array-contains', loggedInUser?.email)
  );
  const [conversationSnapshot, __loading, __error] = useCollection(
    getAllConversationEmailsQuery
  );

  // Get all conversation and set it to useState
  const allConversations = conversationSnapshot?.docs;
  const [listConversations, setListConversations] = useState(allConversations);

  // USEEFFECT
  // Checking when conversationSnapshot is fully loaded, will set the newest conversationSnapshot to listConversations
  useEffect(() => {
    setListConversations(conversationSnapshot?.docs);
  }, [conversationSnapshot]);

  // Checking when findingEmailAddress is empty, reset the listConversations
  useEffect(() => {
    if (!findingEmailAddress) setListConversations(allConversations);
  }, [findingEmailAddress]);

  // Close dialog function
  const onCloseDialog = (status: boolean) => {
    setOpenDialog(status);
    if (!status) setRecipientAddress('');
  };

  // Checking the recipient addess is existed or not
  const checkExistedConversation = (recipientAddress: string) =>
    conversationSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientAddress)
    );

  // Create new conversation function
  const onCreateConversation = async () => {
    if (!recipientAddress) return;
    if (
      EmailValidator.validate(recipientAddress) &&
      recipientAddress !== (loggedInUser?.email as string) &&
      !checkExistedConversation(recipientAddress)
    ) {
      // Add converstion to firebase
      await addDoc(collection(db, 'conversations'), {
        users: [loggedInUser?.email, recipientAddress],
      });
    }

    onCloseDialog(false);
  };

  // Logout function
  const onLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  // Searching conversation function
  const onSearchConversation = () => {
    if (findingEmailAddress) {
      const filteredEmailAddress = allConversations?.filter((c) =>
        c.data().users.includes(findingEmailAddress)
      );
      setListConversations(filteredEmailAddress);
    }
  };

  return (
    <StyledWrapper>
      <StyledHeader>
        <Tooltip title={loggedInUser?.email as string} placement="right">
          <StyledAvatarUser src={loggedInUser?.photoURL || ''} />
        </Tooltip>
        <div>
          <IconButton>
            <Tooltip title="New Conversation">
              <ChatIcon onClick={() => onCloseDialog(true)} />
            </Tooltip>
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton>
            <Tooltip title="Logout">
              <LogoutIcon onClick={onLogout} />
            </Tooltip>
          </IconButton>
        </div>
      </StyledHeader>
      <StyledSearch>
        <SearchIcon onClick={onSearchConversation} />
        <StyledSearchInput
          placeholder="Search in conversation"
          onChange={(e) => setFindingEmailAddress(e.target.value)}
        />
      </StyledSearch>

      {listConversations?.map((doc) => {
        return (
          <ConversationSelect
            key={doc.id}
            id={doc.id}
            conversationUsers={doc.data().users}
          ></ConversationSelect>
        );
      })}

      <Dialog open={isOpenDialog} onClose={() => onCloseDialog(false)}>
        <DialogTitle>New Conversation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter an user email that you wish to chat with
          </DialogContentText>
          <TextField
            autoFocus
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            value={recipientAddress}
            onChange={(event) => {
              setRecipientAddress(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onCloseDialog(false)}>Cancel</Button>
          <Button disabled={!recipientAddress} onClick={onCreateConversation}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </StyledWrapper>
  );
};

export default SideBar;
