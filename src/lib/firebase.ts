// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  projectId: 'projectID',
  appId: 'app id here!',
  apiKey: 'your api key here!',
  authDomain: 'Fill your domain',
  measurementId: '',
  messagingSenderId: '985223662347',
};

const app = initializeApp(firebaseConfig);
