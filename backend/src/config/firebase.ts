import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./conn";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";





export const fireApp = initializeApp(firebaseConfig);
export const fireAnalytics = getAnalytics(fireApp);
export const fireAuth = getAuth(fireApp);
export const fireStorage = getStorage(fireApp);
