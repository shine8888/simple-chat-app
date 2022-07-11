import type { AppProps } from 'next/app';
import Login from './login';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, _error] = useAuthState(auth);

  useEffect(() => {
    const setUserToFirebase = async () => {
      try {
        // write doc to database
        await setDoc(
          doc(db, 'users', loggedInUser?.uid as string),
          {
            uid: loggedInUser?.uid,
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser?.photoURL,
          },
          { merge: true } // merge the field when it was changed
        );
      } catch (error) {
        console.log(error);
      }
    };

    if (loggedInUser) setUserToFirebase();
  }, [loggedInUser]);

  if (loading) return <Loading />;

  if (!loggedInUser) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
