import express, { Request, Response } from "express";
import "dotenv/config";
import { filesUpload } from "../service/testService";
const router = express.Router();
const { v4: uuidv4 } = require("uuid");


// import multer from "multer";
// import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

// const upload = multer({ storage: multer.memoryStorage()});

// router.post("/fileAdd", upload.array('multipartFiles'), async (req: Request, res: Response, next) => {

//     // const storage = getStorage();

//     // const storageRef = ref(storage, `files/${req.file.originalname}`);

//     // await uploadBytes(storageRef, req.file.buffer)
//     // .then((snapshot) => {
//     //     console.log("file uplaoded");
//     // });
//     // let uid = uuidv4();
//     // const storage = getStorage();

//     // const storageRef = ref(storage);

//     // const imageRef = ref(storageRef, "cover");

//     // const spaceRef = ref(imageRef, uid + "-" + req.file.originalname);

//     // await uploadBytes(spaceRef, req.file.fileRef)
//     // .then(snapshot => {
//     //     console.log(snapshot);
//     // })
//     // .catch(err => console.log("UPLOAD ERR", err));

// });

// router.post("/fileAdd", filesUpload, async (req: any, res: Response, next) => {
//     // res.status(200)
// });




var multiparty = require('multiparty');

// router.post("/fileAdd", async (req: Request, res: Response, next) => {

// })





export default router