import "dotenv/config";

const FirebaseStorage = require('multer-firebase-storage');
import multer from "multer";

export const coverMulter = multer({
    storage: FirebaseStorage({
        bucketName: process.env.FIRE_BUCKET,
        credentials: {
            clientEmail: process.env.FIRE_CEMAIL,
            privateKey: (process.env.FIRE_PRIVATE_KEY !== undefined ? process.env.FIRE_PRIVATE_KEY.replace(/\\n/g, '\n') : ""),
            projectId: process.env.FIRE_PROJECT_ID
        },
        directoryPath:`cover`,
        unique: true
    }),
})

export const editMulter = multer({
    storage: FirebaseStorage({
        bucketName: process.env.FIRE_BUCKET,
        credentials: {
            clientEmail: process.env.FIRE_CEMAIL,
            privateKey: (process.env.FIRE_PRIVATE_KEY !== undefined ? process.env.FIRE_PRIVATE_KEY.replace(/\\n/g, '\n') : ""),
            // privateKey: process.env.FIRE_PRIVATE_KEY,
            projectId: process.env.FIRE_PROJECT_ID
        },
        directoryPath:`edit`,
        unique: true
    }),
})