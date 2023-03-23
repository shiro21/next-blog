// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { ref, getStorage } from "firebase/storage";
const { v4: uuidv4 } = require("uuid");
import 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIRE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIRE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIRE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIRE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIRE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIRE_APP_ID
};

// Initialize Firebase
const fireApp = initializeApp(firebaseConfig);
const fireStorage = getStorage(fireApp);

const storage = getStorage();
const storageRef = ref(storage)
let _uuid = uuidv4();

export { fireApp, fireStorage, storage, storageRef, _uuid };