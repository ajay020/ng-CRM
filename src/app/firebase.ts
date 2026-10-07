import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCknXLNcPr9SK3xdNHwtMJUHFReLax0tHY',
  authDomain: 'crm-dashboard-3fe74.firebaseapp.com',
  projectId: 'crm-dashboard-3fe74',
  storageBucket: 'crm-dashboard-3fe74.firebasestorage.app',
  messagingSenderId: '943633336190',
  appId: '1:943633336190:web:dd81da9d50dcd4b369552f',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
