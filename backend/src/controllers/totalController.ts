import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { multer } from "../config/plugins";
// const FirebaseStorage = require('multer-firebase-storage');
// import { FirebaseStorage } from "firebase/storage";
// import { fireStorage } from "../config/firebase";
// import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { mongoose } from "../config/plugins";
import models from "../config/models";
// import { coverMulter, editMulter } from "../service/uploadService";

const router = express.Router();

router.post("/categoryAndPosts",  async (req: Request, res: Response) => {

    let categories;
    let posts;
    let links;

    await models.Category.find({isDeleted: false})
    .populate("children")
    .then(arrCategory => {
        categories = arrCategory;
    })
    .catch(err => console.log("Category Find Err", err));

    await models.Write.find({ isDeleted: false })
    .populate("owner")
    .sort({createdAt: -1})
    .then(arrPost => {
        posts = arrPost
    })
    .catch(err => console.log("Write Find Err", err));

    await models.Link.find({ isDeleted: false })
    .sort({createdAt: -1})
    .then(arrLink => {
        links = arrLink
    })
    .catch(err => console.log("Write Find Err", err));

    res.status(200).json({
        code: "y",
        categories: categories,
        posts: posts,
        links: links
    })
});

router.post("/params",  async (req: Request, res: Response) => {

    const item = req.body;
    let categories;
    let posts;

    if (item.type.params.length === 1) {
        await models.Write.find({ label: item.type.params, isDeleted: false })
        .populate("owner")
        .sort({createdAt: -1})
        .then(arrPost => {
            posts = arrPost
        })
        .catch(err => console.log("Write Find Err", err));
    } else {
        await models.Write.find({ subLabel: item.type.params.at(-1), isDeleted: false })
        .populate("owner")
        .sort({createdAt: -1})
        .then(arrPost => {
            posts = arrPost
        })
        .catch(err => console.log("Write Find Err", err));
    }

    await models.Category.find({isDeleted: false})
    .populate("children")
    .then(arrCategory => {
        categories = arrCategory;
    })
    .catch(err => console.log("Category Find Err", err));

    res.status(200).json({
        code: "y",
        categories: categories,
        posts: posts
    })
});

router.post("/guestCreate",  async (req: Request, res: Response) => {

    const { contents, secret, nick, isDeleted } = req.body;

    const guest = new models.Guest({
        _id:        new mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        contents:   contents,
        secret:     secret,
        nick:       nick
    });

    await guest.save();

    models.Guest.find({isDeleted: isDeleted})
    .then(result => {
        res.status(200).json({
            code: "y",
            data: result
        })
    })
    .catch(err => console.log("Guest Find Err", err));
});

router.post("/guestFind",  async (req: Request, res: Response) => {
    const { isDeleted } = req.body;

    models.Guest.find({isDeleted: isDeleted})
    .then(result => {
        res.status(200).json({
            code: "y",
            data: result
        })
    })
    .catch(err => console.log("Guest Find Err", err));
});


export default router;