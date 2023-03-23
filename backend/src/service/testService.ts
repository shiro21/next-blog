import express, { Request, Response, NextFunction } from "express";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import "dotenv/config";
const { v4: uuidv4 } = require("uuid");

// const { initializeApp, cert } = require('firebase-admin/app');

// const serviceAccount = {
//     "type": "service_account",
//     "project_id": process.env.FIRE_PROJECT_ID,
//     "private_key_id": process.env.FIRE_KEY_ID,
//     "private_key": (process.env.FIRE_PRIVATE_KEY !== undefined ? process.env.FIRE_PRIVATE_KEY.replace(/\\n/g, '\n') : ""),
//     "client_email": process.env.FIRE_CEMAIL,
//     "client_id": process.env.FIRE_CLIENT_ID,
//     "auth_uri": process.env.FIRE_AUTH_URI,
//     "token_uri": process.env.FIRE_TOKEN_URI,
//     "auth_provider_x509_cert_url": process.env.FIRE_AUTH_PROVIDER,
//     "client_x509_cert_url": process.env.FIRE_CLIENTX509
// }

// initializeApp({
//   credential: cert(serviceAccount),
//   storageBucket: process.env.FIRE_BUCKET
// });

const Busboy = require('busboy');
// busboy
export const filesUpload = async (req: Request, res: Response, next: NextFunction) => {

    let busboy = Busboy({ headers: req.headers })
    let uid = uuidv4();

    await busboy.on('file', async (fieldname: string, file: any, filename: any, encoding: any, mimetype: any) => {
        console.log("file 들어옴");
        const storage = getStorage();

        const storageRef = ref(storage)

        const imageRef = ref(storageRef, "cover");

        const spaceRef = ref(imageRef, uid + "-" + filename.filename);

        await file.on("data", async (data: any) => {
            console.log("Data 들어옴");
            await uploadBytes(spaceRef, data)
            .then(async (snapshot) => {
                console.log("uploadBytes 들어옴");
                await getDownloadURL(ref(storage, snapshot.metadata.fullPath))
                .then(_url => {
                    console.log("getDownloadURL 들어옴");
                    res.status(200).json({
                        code: "y",
                        data: _url
                    })
                })
            })
        })

        busboy.on('error', (e: any) => {
            console.log("ERR", e);
        });
    
    })

    busboy.on('finish', (e: any) => {
        next();
    })

    req.pipe(busboy);
}
