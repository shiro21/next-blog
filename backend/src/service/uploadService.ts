import "dotenv/config";

const FirebaseStorage = require('multer-firebase-storage');
import multer from "multer";

export const editMulter = multer({
    storage: FirebaseStorage({
        bucketName: process.env.FIREBASE_BUCKET,
        credentials: {
            clientEmail: process.env.FIREBASE_CEMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY !== undefined ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : ""),
            projectId: process.env.FIREBASE_PROJECT_ID
        },
        directoryPath:`profile`,
        unique: true
    }),
})
