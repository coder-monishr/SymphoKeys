// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  projectId: 'projectID',
  appId: 'app id here!',
  apiKey: 'your api key here!',
  authDomain: 'Fill your domain',
  measurementId: '',
  messagingSenderId: 'SenderID',
};

const app = initializeApp(firebaseConfig);
