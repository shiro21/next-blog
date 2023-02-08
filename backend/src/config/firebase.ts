import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./conn";


export const fireApp = initializeApp(firebaseConfig);
export const fireAnalytics = getAnalytics(fireApp);