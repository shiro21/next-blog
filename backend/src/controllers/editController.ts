import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { multer } from "../config/plugins";
const FirebaseStorage = require('multer-firebase-storage');
// import { FirebaseStorage } from "firebase/storage";
import { fireStorage } from "../config/firebase";
import { getDownloadURL, ref, getStorage, getMetadata } from "firebase/storage";
import { mongoose } from "../config/plugins";
import models from "../config/models";
import { coverMulter, editMulter } from "../service/uploadService";

const router = express.Router();



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
});

// 글 생성
router.post("/create", coverMulter.single("coverImage"), async (req: Request, res: Response) => {
    const item = req.body;
    const file: any | Express.Multer.File = req.file;
    let mainCategory: mongoose.Types.ObjectId | undefined = undefined;
    let subCategory: mongoose.Types.ObjectId | undefined = undefined;

    let mainLabel = item.select;
    let subLabel = item.select;

    if (item.select.indexOf("/") > -1) {
        mainLabel = item.select.split("/")[0];
        subLabel = item.select.split("/").at(-1);

        await models.SubCategory.findOne({ label: item.select })
        .then(_sub => {
            if (!_sub) return;

            mainCategory = _sub.parent;
            subCategory = _sub._id;

            /* Save 내용 */
            _sub.entries = _sub.entries + 1
            
            _sub.save();

            models.Category.findOne({ _id: _sub.parent })
            .then(_main => {
                if (!_main) return;
                _main.entries = _main.entries + 1
                _main.save();
            })
            .catch(err => console.log("Main Category Entries err", err));
        })
        .catch(err => console.log("SubCategory Err", err));
    } else {
        await models.Category.findOne({ label: item.select })
        .then(_main => {
            if (!_main) return;

            mainCategory = _main._id

            /* Save 내용 */

            _main.entries = _main.entries + 1;

            _main.save();
        })
        .catch(err => console.log("SubCategory Err", err));
    }

    try {
        const storage = getStorage();
        await getDownloadURL(ref(storage, file.path))
        .then((url: string) => {
            
            const edit = new models.Write({
                _id:        new mongoose.Types.ObjectId(),
                createdAt:  new Date(),
                updatedAt:  new Date(),
                
                title:      item.title,
                edit:       item.edit,
                tag:        item.tagData,
                category:   mainCategory,
                subCategory:subCategory,
                coverImage: url,
                label:      mainLabel,
                subLabel:   subLabel,
                owner:      item.owner
            });

            edit.save()
            .then(result => {
                res.status(200).json({
                    code: "y"
                });
            })
            .catch(err => console.log("Edit Create Err", err));
        })
    } catch (err) {
        console.log(err);
    }
    
});

router.post("/uploadDecoded", async (req: Request, res: Response) => {
    
    const { image } = req.body;
    const storage = getStorage();

    const data = ref(storage, image);

    await getMetadata(data)
    .then(meta => {
        res.status(200).json({
            code: "y",
            data: meta
        });
    })
    .catch(err => console.log("MetaData Err", err));

});

router.post("/update", coverMulter.single("coverImage"), async (req: Request, res: Response) => {

    const item = req.body;
    const file: any | Express.Multer.File = req.file;

    let mainLabel = item.select;
    let subLabel = item.select;
    // let mainCategory: mongoose.Types.ObjectId | undefined = undefined;
    // let subCategory: mongoose.Types.ObjectId | undefined = undefined;

    if (item.select.indexOf("/") > -1) {
        mainLabel = item.select.split("/")[0];
        subLabel = item.select.split("/").at(-1);
    }

    const storage = getStorage();
    let imageData = "";
    
    if (file !== undefined) {
        await getDownloadURL(ref(storage, file.path))
        .then((url: string) => {
            imageData = url;
        })
        .catch(err => console.log("Image Err", err));
    } else {
        imageData = item.oldImage;
    }

    await models.Write.findOne({_id: item._id})
    .then(async _update => {

        if (_update === null) return;
        
        if (_update.label !== mainLabel) {
            await models.Category.findOne({ label: _update.label })
            .then(_entry => {

                if (_entry === null) return;

                _entry.updatedAt = new Date();
                _entry.entries = _entry.entries - 1;

                _entry.save();
            })
            .catch(err => console.log("Entries Update Err", err));

            await models.Category.findOne({ label: mainLabel })
            .then(_entry => {

                if (_entry === null) return;

                // 새로운 카테고리로 교체
                _update.category = _entry._id;
                _update.label = _entry.label;

                _entry.updatedAt = new Date();
                _entry.entries = _entry.entries + 1;

                _entry.save();

            })
            .catch(err => console.log("Entries Update Err", err));
        }
        if (_update.subLabel !== subLabel) {

            await models.SubCategory.findOne({ label: _update.label })
            .then(_entry => {

                if (_entry === null) return;

                _entry.updatedAt = new Date();
                _entry.entries = _entry.entries - 1;

                _entry.save();
            })
            .catch(err => console.log("Entries Update Err", err));

            await models.SubCategory.findOne({ label: `${mainLabel}/${subLabel}`})
            .then(_subEntry => {

                if (_subEntry === null) return;

                // 새로운 카테고리로 교체
                _update.subCategory = _subEntry._id;
                _update.subLabel = _subEntry.label;

                _subEntry.updatedAt = new Date();
                _subEntry.entries = _subEntry.entries + 1;

                _subEntry.save();

            })
            .catch(err => console.log("SubEntries Update Err", err));
        }
        
        _update.updatedAt   = new Date();
        
        _update.title       = item.title;
        _update.edit        = item.edit;
        _update.tag         = item.tagData;
        _update.coverImage  = imageData
        
        _update.save()
        .then(update => {
            res.status(200).json({
                code: "y"
            })
        })
        .catch(err => console.log("Update Err", err));
    })
    .catch(err => console.log("Write Update Err", err));
});

router.post("/deleted", coverMulter.single("coverImage"), async (req: Request, res: Response) => {

    const { _id, isDeleted } = req.body;

    models.Write.findOne({ _id: _id })
    .then(async _delete => {
        if (_delete === null) return;
        
        _delete.updatedAt = new Date();
        _delete.isDeleted = true;

        _delete.save();

        await models.Category.findOne({ label: _delete.label })
        .then(result => {
            if (result === null) return;

            result.updatedAt = new Date();
            result.entries = result.entries - 1;

            result.save();
        })
        .catch(err => console.log("Category Load Err", err));

        if (_delete.label !== _delete.subLabel) {
            console.log("삭제하러 들어왔음");
            await models.SubCategory.findOne({ label: `${_delete.label}/${_delete.subLabel}` })
            .then(result => {
                console.log("Null 아님");
                if (result === null) return;

                result.updatedAt = new Date();
                result.entries = result.entries - 1;
    
                result.save();
            })
            .catch(err => console.log("SubCategory Load Err", err));
        }

        let posts;
        let categories;

        await models.Write.find({isDeleted: isDeleted})
        .then(result => {
            posts = result;
        })
        .catch(err => console.log("Write Deleted Err", err));

        await models.Category.find()
        .populate("children")
        .then(arrCategory => {
            categories = arrCategory;
        })
        .catch(err => console.log("Category Find Err", err));

        res.status(200).json({
            code: "y",
            posts: posts,
            categories: categories
        })
    })
    .catch(err => console.log("Write Delete Err", err));
});

router.post("/commentCreate", async (req: Request, res: Response) => {

    const { nick, password, comment, secret, isDeleted, owner } = req.body;

    const comments = new models.Comment({
        _id:        new mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        nick:       nick,
        password:   password,
        comment:    comment,
        secret:     secret,
        owner:      owner
    });

    await comments.save();
    
    models.Comment.find({ owner: owner, isDeleted: isDeleted })
    .then(comment => {
        res.status(200).json({
            code: "y",
            data: comment
        });
    })
    .catch(err => console.log("Comment Find Err", err));
    
});

router.post("/commentFind", async (req: Request, res: Response) => {
    
    const { owner, isDeleted } = req.body;

    models.Comment.find({ owner: owner, isDeleted: isDeleted })
    .then(comment => {
        res.status(200).json({
            code: "y",
            data: comment
        });
    })
    .catch(err => console.log("Comment Find Err", err));

});

router.post("/commentDelete", async (req: Request, res: Response) => {

    const { nick, password, owner, isDeleted } = req.body;
    
    models.Comment.findOne({ nick: nick, password: password })
    .then(_delete => {
        if (_delete === null) {
            res.status(200).json({
                code: "password",
                message: "패스워드가 다릅니다."
            })
        } else {

            _delete.updatedAt = new Date();
            _delete.isDeleted = true;

            _delete.save();

            models.Comment.find({ owner: owner, isDeleted: isDeleted })
            .then(result => {
                res.status(200).json({
                    code: "y",
                    data: result
                })
            })
            .catch(err => console.log("Comment Delete Err", err));
            
        }
        
    })
    .catch(err => console.log("Comment Delete Err", err));
});

router.post("/statistics", async (req: Request, res: Response) => {

    const d = new Date();
    const year = d.getFullYear(); // 년
    const month = d.getMonth();   // 월
    const day = d.getDate();      // 일

    let recentData;
    let popularData;

    await models.Write.find({createdAt: {$gte: new Date(year, month, day - 7).toLocaleDateString()}})
    .sort({count: -1})
    .limit(5)
    .then(result => {
        recentData = result;
    })
    .catch(err => console.log("Write Load Err", err));

    await models.Write.find()
    .sort({createdAt: -1})
    .limit(5)
    .then(result => {
        popularData = result;
    })
    .catch(err => console.log("Write Load Err", err));

    res.status(200).json({
        code: "y",
        recent: recentData,
        popular: popularData
    });

});

router.post("/postsFind", async (req: Request, res: Response) => {

    const item = req.body;

    models.Write.find(item)
    .populate("owner")
    .then(result => {
        res.status(200).json({
            code: "y",
            data: result
        });
    })
    .catch(err => console.log("Tag Find Err", err));
});

router.post("/test", async (req: Request, res: Response) => {

    const storage = fireStorage;

});

export default router;