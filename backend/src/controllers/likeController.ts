import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { multer } from "../config/plugins";
const FirebaseStorage = require('multer-firebase-storage');
// import { FirebaseStorage } from "firebase/storage";
import { fireStorage } from "../config/firebase";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { mongoose } from "../config/plugins";
import models from "../config/models";
import { coverMulter, editMulter } from "../service/uploadService";

const router = express.Router();

router.post("/like",  async (req: Request, res: Response) => {

    const { name, _id } = req.body;

    let sameLike = false;
    // {name: name, _id: _id}
    await models.Like.findOne({$and:[ {name: name}, {write: _id} ]})
    .then(result => {
        if (result) sameLike = true;
    })
    .catch(err => console.log("Like Find Err", err));

    if (sameLike) {
        return res.status(200).json({
            code: "n",
            message: "이미 좋아요가 있습니다."
        });
    }

    const like = new models.Like({
        _id:        new mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        name:       name,
        write:      _id
    });

    like.save()
    .then(result => {
        models.Like.find({ write: _id })
        .then(like => {
            res.status(200).json({
                code: "y",
                data: like
            });
        })
        .catch(err => console.log("Like Load Err", err));
    })
    .catch(err => console.log("Like Create Err", err));
});

router.post("/find",  async (req: Request, res: Response) => {

    const { _id } = req.body;

    models.Like.find({write: _id })
    .then(like => {
        res.status(200).json({
            code: "y",
            data: like
        });
    })
    .catch(err => console.log("Like Load Err", err));
});

export default router;

