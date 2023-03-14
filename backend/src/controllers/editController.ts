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
        models.Category.find({isDeleted: false})
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

        models.Category.findOne({_id: item.parent, isDeleted: false})
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

    const item = req.body;

    await models.Category.find(item)
    .populate("children")
    .then((arrCategory: any) => {
        for (let i = 0; i < arrCategory.length; i++) {
            arrCategory[i].children = arrCategory[i].children.filter((item: any) => item.isDeleted !== true)
        }
        res.status(200).json({
            code: "y",
            data: arrCategory
        })
    })
    .catch(err => console.log("Category Find Err", err));
});

router.post("/categoryUpdate", async (req: Request, res: Response) => {
    const { _id, name, list } = req.body;

    if (list === "main") {
        models.Category.findOne({_id: _id})
        .then(_update => {
            if (_update === null) return;

            _update.updatedAt = new Date();
            _update.name = name;
            _update.label = name;

            _update.save()
            .then(result => {
                res.status(200).json({
                    code: "y",
                    data: result
                })

                models.SubCategory.find({parent: _id})
                .then(_subUpdate => {
                    if (_subUpdate === null) return;

                    for (let i = 0; i < _subUpdate.length; i++) {
                        let dLabel = _subUpdate[i].label?.split("/").at(-1);

                        _subUpdate[i].updatedAt = new Date();
                        _subUpdate[i].label = name + "/" + dLabel;
                        _subUpdate[i].save();
                    }

                })
                .catch(err => console.log("Sub Update Err", err));
                
                models.Write.find({category: _id})
                .then(_write => {
                    if (_write === null) return;

                    for (let i = 0; i < _write.length; i++) {
                        _write[i].updatedAt = new Date();
                        _write[i].label = name;

                        if (!_write[i].subCategory) _write[i].subLabel = name;

                        _write[i].save();
                    }
                })
                .catch(err => console.log("Wirte Update Err", err));
            })
            .catch(err => console.log("Category Update Err", err));
        })
        .catch(err => console.log("Category Find Err", err));
    } else if (list === "sub") {
        models.SubCategory.findOne({_id: _id})
        .then(_update => {
            if (_update === null) return;

            let dLabel = _update.label?.split("/")[0];

            _update.updatedAt = new Date();
            _update.name = name;
            _update.label = dLabel + "/" + name;

            _update.save()
            .then(result => {
                res.status(200).json({
                    code: "y",
                    data: result
                })

                models.Write.find({subCategory: _id})
                .then(_write => {
                    if (_write === null) return;

                    for (let i = 0; i < _write.length; i++) {
                        _write[i].updatedAt = new Date();
                        _write[i].subLabel = name;

                        _write[i].save();
                    }
                })
                .catch(err => console.log("Write Update Err", err));
            })
            .catch(err => console.log("SubCategory Update Err", err));
        })
        .catch(err => console.log("SubCategory Update Err", err));
    }
})

router.post("/categoryDelete", async (req: Request, res: Response) => {

    const item = req.body;
    
    // 삭제됐는지 확인하기
    let writeDeleted = false;
    let subWriteDeleted = false;


    if (item.name === item.label) {
        await models.Write.find({ label: item.name, isDeleted: false })
        .then(_confirm => {
            if (_confirm === null) return;
    
            if (_confirm.length > 0) writeDeleted = true;
    
        })
        .catch(err => console.log("Category Delete Confirm Err", err));
    }

    await models.Write.find({ label: item.name, subLabel: item.label, isDeleted: false })
    .then(_confirm => {
        if (_confirm === null) return;

        if (_confirm.length > 0) writeDeleted = true;

    })
    .catch(err => console.log("Category Delete Confirm Err", err));

    if (writeDeleted) {
        return res.status(200).json({
            code: "n",
            message: "카테고리에 글을 모두 지워주세요."
        })
    }

    await models.Category.findOne(item)
    .then(async category => {
        if (category === null) return;
        else if (category.children.length > 0) {
            for (let i = 0; i < category.children.length; i++) {
                await models.SubCategory.findOne({_id: category.children[i], isDeleted: false})
                .then(_sub => {
                    console.log(_sub);
                    if (_sub === null) return;

                    subWriteDeleted = true;
                })
                .catch(err => console.log("SubCategory Load Err", err));

                if (subWriteDeleted) return;
            }
        }
    })
    .catch(err => console.log("Category Err", err));

    if (subWriteDeleted) {
        return res.status(200).json({
            code: "n",
            message: "카테고리 삭제 요망"
        })
    }

    if (item.name === item.label) {
        models.Category.findOne({_id: item._id})
        .then(_delete => {
            if (_delete === null) return;

            _delete.updatedAt = new Date();
            _delete.isDeleted = true;

            _delete.save()
            .then(async result => {
                await models.Category.find({isDeleted: false})
                .populate("children")
                .then(category => {
                    res.status(200).json({
                        code: "y",
                        data: category
                    })
                })
                .catch(err => console.log("Category Find Err", err));
            })
            .catch(err => console.log("Category Err", err));
        })
        .catch(err => console.log("Category Deleted Err", err));
    } else {
        models.SubCategory.findOne(item)
        .then(_delete => {
            if (_delete === null) return;

            _delete.updatedAt = new Date();
            _delete.isDeleted = true;

            _delete.save()
            .then(async result => {
                await models.Category.find({isDeleted: false})
                .populate("children")
                .then((category: any) => {
                    if (category === null) return;
                    
                    for (let i = 0; i < category.length; i++) {
                        category[i].children = category[i].children.filter((item: any) => item.isDeleted !== true)
                    }
                    res.status(200).json({
                        code: "y",
                        data: category
                    })
                })
                .catch(err => console.log("Category Find Err", err));
            })
            .catch(err => console.log("Category Err", err));
        })
    }
    // await models.
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

            let subCate;

            if (subCategory) subCate = subCategory;
            else subCate = mainCategory;
            
            const edit = new models.Write({
                _id:        new mongoose.Types.ObjectId(),
                createdAt:  new Date(),
                updatedAt:  new Date(),
                
                title:      item.title,
                edit:       item.edit,
                tag:        item.tagData,
                category:   mainCategory,
                subCategory:subCate,
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

            await models.SubCategory.findOne({ label: _update.label + "/" + _update.subLabel })
            .then(_sub => {
                if (_sub === null) return;

                _sub.updatedAt = new Date();
                _sub.entries = _sub.entries - 1;

                _sub.save();
            })
            .catch(err => console.log("SubCategory Update Err", err));

            await models.Category.findOne({ label: mainLabel })
            .then(_entry => {

                if (_entry === null) return;

                // 새로운 카테고리로 교체
                _update.category = _entry._id;
                _update.label = _entry.name;

                _entry.updatedAt = new Date();
                _entry.entries = _entry.entries + 1;

                _entry.save();

            })
            .catch(err => console.log("Entries Update Err", err));
        }
        if (_update.subLabel !== subLabel) {

            await models.SubCategory.findOne({ label: _update.label + "/" +  _update.subLabel })
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
                _update.subLabel = _subEntry.name;

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
        _update.coverImage  = imageData;
        if (_update.label === item.select) {
            _update.subCategory = _update.category;
            _update.subLabel = item.select;
        }
        
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

            await models.SubCategory.findOne({ label: `${_delete.label}/${_delete.subLabel}` })
            .then(result => {

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

    models.Notify.find({owner: _id, isDeleted: false})
    .then(_update => {
        if (_update.length === 0) return;

        for (const ele of _update) {
            ele.updatedAt = new Date();
            ele.isDeleted = true;
            ele.save();
        }
    })
    .catch(err => console.log("Notify Update Err", err));

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

    const notify = new models.Notify({
        _id:        new mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        nick:       nick,
        owner:      owner,
        comment:   comment
    });

    notify.save();
    
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

    const { _id, password, owner, isDeleted } = req.body;
    
    await models.Comment.findOne({ _id: _id, password: password })
    .then(async _delete => {
        if (_delete === null) {
            res.status(200).json({
                code: "password",
                message: "패스워드가 다릅니다."
            })
        } else {

            _delete.updatedAt = new Date();
            _delete.isDeleted = true;

            await _delete.save();
            
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