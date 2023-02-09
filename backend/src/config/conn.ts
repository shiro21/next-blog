import "dotenv/config";

export const database = {
    path: process.env.NODE_DATABASE || ""
};

export const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTO_DOMAIN || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || "",
    measurementId: process.env.FIREBASE_MESAUREMENT_ID || ""
};

export const firebaseStorage = {
    bucketName: process.env.FIREBASE_BUCKET,
    credentials: {
        clientEmail: process.env.FIREBASE_CEMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY !== undefined ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : "") || "",
        projectId: process.env.FIREBASE_PROJECT_ID
    },
}