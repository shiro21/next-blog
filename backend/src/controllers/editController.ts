import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { multer } from "../config/plugins";
const FirebaseStorage = require('multer-firebase-storage');
// import { FirebaseStorage } from "firebase/storage";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { fireMulter } from "../service/uploadService";
const firebaseFile = fireMulter.array('files');

const router = express.Router();

const editMulter = multer({
    storage: FirebaseStorage({
        bucketName: process.env.FIREBASE_BUCKET,
        credentials: {
            clientEmail: process.env.FIREBASE_CEMAIL,
            privateKey: (process.env.FIREBASE_PRIVATE_KEY !== undefined ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : ""),
            projectId: process.env.FIREBASE_PROJECT_ID
        },
        directoryPath:`edit`,
        unique: true
    }),
})

// router.post("/fileAdd", editMulter.array("multipartFiles"), async (req: Request, res: Response) => {
    
//     const files: any | Express.Multer.File[] = req.files;

//     console.log(files[0].path);
//     try {
//         const storage = getStorage();
//         await getDownloadURL(ref(storage, files[0].path))
//         .then((url: any) => {
//             console.log(url);
//         })
//         .catch((err: any) => {
//             console.log("Why ??", err)
//         });
    
//         // console.log(files);
//         // res.status(200).json({
//         //     code: "y",
//         //     data: files
//         // })
//     }
//     catch(err) {
//         console.log(err);
//     }

// });

router.post("/fileAdd", async (req: Request, res: Response) => {

    const storage = getStorage();

    firebaseFile(req, res, function (err: any) {
        if (err) throw console.log("에러", err);
        new Promise(function(resolve, reject) {
            const files: any | Express.Multer.File[] = req.files;

            if (files.length > 0) {
                let uploads: any = [];

                for (let i = 0; i < files.length; i++) {
                    getDownloadURL(ref(storage, files[i].path))
                    .then(url => {
                        uploads.push(url);
                        console.log(url);
                        resolve(uploads);
                    })
                    .catch(err => console.log(err));
                }
            } else {
                resolve(null);
            }
        })
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log("why", err));
    })
});

export default router;