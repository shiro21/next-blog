import "dotenv/config";

export const database = {
    path: process.env.NODE_DATABASE || ""
};

// export const firebaseConfig = {
//     apiKey: process.env.FIRE_APIKEY,
//     authDomain: process.env.FIRE_AUTO_DOMAIN || "",
//     projectId: process.env.FIRE_PROJECT_ID || "",
//     storageBucket: process.env.FIRE_STORAGE_BUCKET || "",
//     messagingSenderId: process.env.FIRE_MESSAGING_SENDER_ID || "",
//     appId: process.env.FIRE_APP_ID || "",
//     measurementId: process.env.FIRE_MESAUREMENT_ID || ""
// };

export const firebaseStorage = {
    bucketName: process.env.FIRE_BUCKET,
    credentials: {
        clientEmail: process.env.FIRE_CEMAIL,
        privateKey: (process.env.FIRE_PRIVATE_KEY !== undefined ? process.env.FIRE_PRIVATE_KEY.replace(/\\n/g, '\n') : "") || "",
        projectId: process.env.FIRE_PROJECT_ID
    },
}