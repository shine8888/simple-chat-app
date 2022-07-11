// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB2DGHWbuVLvZwlF_D5wKJ7X5KEdrG5khs',
  authDomain: 'simple-chat-app-71631.firebaseapp.com',
  projectId: 'simple-chat-app-71631',
  storageBucket: 'simple-chat-app-71631.appspot.com',
  messagingSenderId: '532022753727',
  appId: '1:532022753727:web:41412ed2f3c25144ef490a',
};

// Initialize Firebase
// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const GoogleProvider = new GoogleAuthProvider();
const FacebookProvider = new FacebookAuthProvider();

export { db, auth, GoogleProvider, FacebookProvider };
