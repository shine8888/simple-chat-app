import Button from '@mui/material/Button';
import Head from 'next/head';
import Image from 'next/image';
import ChatAppLogo from '../public/chatapplogo.png';
import {
  useSignInWithGoogle,
  useSignInWithFacebook,
} from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import {
  StyledImage,
  StyledLoginContainer,
  StyledLoginMethod,
  StyledLoginWrapper,
} from '../styled-components/StyledLogin';
import IconButton from '@mui/material/IconButton';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import Tooltip from '@mui/material/Tooltip';

const Login = () => {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth);
  const [signInWithFacebook, __user, __loading, __error] =
    useSignInWithFacebook(auth);

  const onLoginWithGoogle = () => {
    signInWithGoogle();
  };

  const onLoginWithFacebook = () => {
    signInWithFacebook();
  };

  return (
    <StyledLoginWrapper>
      <Head>
        <title>Login</title>
      </Head>

      <StyledLoginContainer>
        <StyledImage>
          <Image
            src={ChatAppLogo}
            alt="Chat App Logo"
            height="200px"
            width="200px"
          />
        </StyledImage>
        <StyledLoginMethod>
          <IconButton>
            <Tooltip title="Login with Google account">
              <GoogleIcon onClick={onLoginWithGoogle} color="success" />
            </Tooltip>
          </IconButton>
          <IconButton>
            <Tooltip title="Login with Facebook account">
              <FacebookIcon onClick={onLoginWithFacebook} color="primary" />
            </Tooltip>
          </IconButton>
        </StyledLoginMethod>
      </StyledLoginContainer>
    </StyledLoginWrapper>
  );
};

export default Login;
