import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore"; //for lecture 3.0~
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase; //Log In 하는 과정에서 필요했음(2.5)

export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage(); //file uploading 과정에서 필요했음(4.2)
