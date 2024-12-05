// src/utils/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Impor Firestore

const firebaseConfig = {
  apiKey: 'AIzaSyCygLkwgZr7vhS5736sNuvx_Oh3e-Gfwjk',
  authDomain: 'responsi-galih.firebaseapp.com',
  projectId: 'responsi-galih',
  storageBucket: 'responsi-galih.firebasestorage.app',
  messagingSenderId: '259152233910',
  appId: '1:259152233910:web:30c2ffb843a9bee54b6d17',
  measurementId: 'G-C1G99C64X0',
};

// Inisialisasi Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Inisialisasi Auth dan Firestore
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebaseApp); // Tambahkan inisialisasi Firestore

export { auth, db, googleProvider }; // Eksport db untuk digunakan di tempat lain
