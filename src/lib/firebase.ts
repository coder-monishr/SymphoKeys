// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  projectId: 'studio-7718316245-b67b6',
  appId: '1:985223662347:web:5a59cb6d866781dfc4b00e',
  apiKey: 'AIzaSyBV55MdwWucj-lNRQgbyJKvggGFypw3i5A',
  authDomain: 'studio-7718316245-b67b6.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '985223662347',
};

const app = initializeApp(firebaseConfig);
