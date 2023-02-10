import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { multer } from "../config/plugins";
const FirebaseStorage = require('multer-firebase-storage');
// import { FirebaseStorage } from "firebase/storage";
import { fireStorage } from "../config/firebase";
import { getDownloadURL, ref, getStorage } from "firebase/storage";

const router = express.Router();

const editMulter = multer({
    storage: FirebaseStorage({
        bucketName: process.env.FIREBASE_BUCKET,
        credentials: {
            clientEmail: process.env.FIREBASE_CEMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY !== undefined ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : ""),
            // privateKey: process.env.FIREBASE_PRIVATE_KEY,
            projectId: process.env.FIREBASE_PROJECT_ID
        },
        directoryPath:`edit`,
        unique: true
    }),
})

router.post("/fileAdd", editMulter.array("multipartFiles"), async (req: Request, res: Response) => {
    
    const files: any | Express.Multer.File[] = req.files;

    try {
        const storage = getStorage();
        await getDownloadURL(ref(storage, files[0].path))
        .then((url: any) => {
            res.status(200).json({
                code: "y",
                data: url
            })
        })
        .catch((err: any) => {
            console.log("DownLoad Err", err)
        });
    }
    catch(err) {
        console.log(err);
    }

});

router.post("/test", async (req: Request, res: Response) => {

    const storage = fireStorage;

});

export default router;