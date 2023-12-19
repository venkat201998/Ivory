// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAswFgml9JoujrRSrR2ObTlIlu9yAR1uGY',
  authDomain: 'ivory-events-management.firebaseapp.com',
  projectId: 'ivory-events-management',
  storageBucket: 'ivory-events-management.appspot.com',
  messagingSenderId: '1082854548083',
  appId: '1:1082854548083:web:bef68edbd40f8172c70006',
  measurementId: 'G-YB7XDPTNW7'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider(app);
