// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIRE_APIKEY,
    authDomain: process.env.FIRE_AUTH_DOMAIN,
    projectId: process.env.FIRE_PROJECT_ID,
    storageBucket: process.env.FIRE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIRE_MESSAGING_SENDER_ID,
    appId: process.env.FIRE_APP_ID
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
const fireStorage = getStorage(fireApp);

export { fireApp, fireStorage };