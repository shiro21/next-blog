import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { multer } from "../config/plugins";
const FirebaseStorage = require('multer-firebase-storage');
// import { FirebaseStorage } from "firebase/storage";
import { fireStorage } from "../config/firebase";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { mongoose } from "../config/plugins";
import models from "../config/models";

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

router.post("/categoryCreate", async (req: Request, res: Response) => {
    const item = req.body;
    
    let _id = new mongoose.Types.ObjectId();

    const category = new models.Category({
        _id:        _id,
        createdAt:  new Date(),
        updatedAt:  new Date(),

        name:       item.name,
        label:      item.label,
        priority:   item.priority,
        entries:    item.entries,
        depth:      item.depth,
        parent:     _id,
        categoryInfo: {
            image: "",
            description: ""
        },
        opened:     item.opened,
        updateData: item.updateData,
        leaf:       item.leaf,
        children:   []
    });

    category.save()
    .then(() => {
        models.Category.find()
        .populate("children")
        .then(category => {
            res.status(200).json({
                code: "y",
                data: category
            })
        })
        .catch(err => console.log("Category Find Err", err));
    })
    .catch(err => console.log("Category Create Err", err));
});

router.post("/subCategoryCreate", async (req: Request, res: Response) => {

    console.log(req.body);
    const item = req.body;
    
    let _id = new mongoose.Types.ObjectId();

    const subCategory = new models.SubCategory({
        _id:        _id,
        createdAt:  new Date(),
        updatedAt:  new Date(),

        name:       item.name,
        label:      item.label,
        priority:   item.priority,
        entries:    item.entries,
        depth:      item.depth,
        parent:     item.parent,
        categoryInfo: {
            image: "",
            description: ""
        },
        opened:     item.opened,
        updateData: item.updateData,
        leaf:       item.leaf,
    });

    subCategory.save()
    .then(subCategory => {

        models.Category.findOne({_id: item.parent})
        .then(_category => {
            if (_category === null) return console.log("카테고리 없어서 나는 에러");
            if (_category.leaf === true) _category.leaf = false;

            _category.children.push(subCategory._id);

            _category.save()
            .then(_children => {

                models.Category.find()
                .populate("children")
                .then(category => {
                    res.status(200).json({
                        code: "y",
                        data: category
                    })
                })
                .catch(err => console.log("Category Find Err", err));
            })
        })
        .catch(err => console.log("SubCategory Create Err", err));
    })
    .catch(err => console.log("Sub Category Create Err", err));

});

router.post("/categoryFind", async (req: Request, res: Response) => {

    await models.Category.find()
    .populate("children")
    .then(arrCategory => {
        res.status(200).json({
            code: "y",
            data: arrCategory
        })
    })
    .catch(err => console.log("Category Find Err", err));


})

router.post("/test", async (req: Request, res: Response) => {

    const storage = fireStorage;

});

export default router;