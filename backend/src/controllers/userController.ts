import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import models from "../config/models";
import { crypto, mongoose, jwt } from "../config/plugins";
import { userEmail } from "../service/emailService";
import { coverMulter } from "../service/uploadService";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
const router = express.Router();

router.post("/emailConfirm", async (req: Request, res: Response) => {

    const { email } = req.body;
    let emailCheck = false;
    let randomCount = Math.floor(Math.random() * 10000);

    await models.User.findOne({ email: email })
    .then(result => {
        if (result !== null) emailCheck = true;
    })
    .catch(err => console.log("Email Search Err", err));

    if (emailCheck) {
        return res.status(200).json({
            code: "email",
            message: "이미 이메일이 존재합니다."
        });
    }
    
    userEmail(email, randomCount);
    
    res.status(200).json({
        code: "y",
        data: randomCount
    })
});

router.post("/create", async (req: Request, res: Response) => {

    const item = req.body;
    let idCheck = false;

    // 여기서부터 시작
    await models.User.findOne({ id: item.id })
    .then(result => {
        if (result !== null) idCheck = true;
    })
    .catch(err => console.log("Register Create Confirm Err"));

    if (idCheck) {
        return res.status(200).json({
            code: "id",
            message: "아이디가 이미 존재합니다."
        })
    }

    const user = new models.User({
        _id:        new mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        id:         item.id,
        email:      item.email,
        type:       item.type,
        role:       item.role,
        roleLabel:  item.roleLabel,
        name:       item.name,
        profile:    item.profile
    });

    user.save()
    .then(result => {
        crypto.randomBytes(64, (err, buf) => {
            crypto.pbkdf2(item.password, buf.toString("base64"), 1010, 64, "sha512", (err, key) => {
                const auth = new models.Auth({
                    _id:        new mongoose.Types.ObjectId(),
                    createdAt:  new Date(),
                    updatedAt:  new Date(),

                    owner:      result._id,
                    passport:   key.toString("base64"),
                    salt:       buf.toString("base64")
                });

                auth.save()
                .then(auth => {
                    jwt.sign({user: user}, "secretkey", { expiresIn: "1 days" }, (err, token) => {
                        res.status(200).json({
                            code: "y",
                            token: token,
                            user: user._id
                        });
                    })
                })
                .catch(err => console.log("Password Create Err"));
            })
        })
    })
    .catch(err => console.log("Register Create Err"));
})

router.post("/find", async (req: Request, res: Response) => {

    models.User.find()
    .then(result => {
        res.status(200).json({
            code: "y",
            data: result[0]
        })
    })
    .catch(err => console.log("Funder User Err", err));
});

router.post("/update", coverMulter.single("file"), async (req: Request, res: Response) => {

    const file: any | Express.Multer.File = req.file;
    const { _id, blog_name, nick_name, subscribe } = req.body;

    const storage = getStorage();
    let imageData = "";

    if (file !== undefined) {
        await getDownloadURL(ref(storage, file.path))
        .then((url: string) => {
            imageData = url;
        })
        .catch(err => console.log("Image Err", err));
    }

    await models.User.findOne({_id: _id})
    .then(_update => {

        if (_update === null) return;

        _update.updatedAt = new Date();
        _update.id = blog_name;
        _update.name = nick_name;
        _update.subscribe = subscribe;
        if (imageData !== "") _update.profile = imageData

        _update.save()
        .then(result => {
            jwt.sign({user: _update}, "secretkey", {expiresIn: "1 days"}, (err, token) => {
                res.status(200).json({
                    code: "y",
                    token: token,
                    data: result
                })
            })
        })
        .catch(err => console.log("User Update Err", err));
    })
    .catch(err => console.log("User Update Err", err));

})

router.post("/login", (req: Request, res: Response) => {

    const { id, password } = req.body;

    models.User.findOne({ id: id })
    .then(user => {
        if (user === null || user === undefined) {
            res.status(200).json({
                code: "id",
                message: "아이디가 존재하지 않습니다."
            })
        } else {
            models.Auth.findOne({ owner: user._id })
            .then(auth => {
                if (auth?.salt === undefined || auth?.passport === undefined) {
                    return console.log("salt, passport Err");
                }
                crypto.pbkdf2(password, auth.salt, 1010, 64, "sha512", (err, key) => {
                    if (key.toString("base64") === auth.passport) {
                        jwt.sign({ user: user }, "secretkey", { expiresIn: "1 days" }, (err, token) => {

                            res.status(200)
                            .cookie("@TEST", token)
                            .json({
                                code: "y",
                                token: token,
                                user: auth.owner
                            });
                        })
                    } else {
                        res.status(200).json({
                            code: "password",
                            message: "비밀번호가 다릅니다."
                        });
                    }
                })
            })
        }
    })
    .catch(err => console.log("User Login Err", err));
});

router.post("/decode", (req: Request, res: Response) => {
    const { token } = req.body;

    const decoded = jwt.decode(token, { complete: true });

    if (decoded === null) {
        res.status(200).json({
            code: "n",
            message: "토큰 에러"
        });        
    } else {
        res.status(200).json({
            code: "y",
            data: decoded.payload
        });
    }
});

router.post("/userAgent", (req: Request, res: Response) => {

    const { write, userAgent, isMobile } = req.body;

    const agent = new models.Agent({
        _id:        new mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        write:      write,
        userAgent:  userAgent,
        isMobile:   isMobile
    });

    agent.save();

    models.Write.findOne({ _id: write })
    .then(_result => {
        if (_result === null) return;
        _result.count = _result.count + 1;

        _result.save();
    })
    .catch(err => console.log("Write Count Err", err));
});

router.post("/userAgentLoad", (req: Request, res: Response) => {

    models.Agent.find()
    .then(result => {
        res.status(200).json({
            code: "y",
            data: result
        });
    })
    .catch(err => console.log("Agent Load Err", err));
});

router.post("/linkCreate", async (req: Request, res: Response) => {

    const { link, linkName } = req.body;

    const linkData = new models.Link({
        _id:        new mongoose.Types.ObjectId(),
        createdAt:  new Date(),
        updatedAt:  new Date(),

        link:       link,
        linkName:   linkName
    });

    await linkData.save();

    models.Link.find()
    .then(result => {
        res.status(200).json({
            code: "y",
            data: result
        });
    })
    .catch(err => console.log("Link Create Err", err));
});

router.post("/linkFind", (req: Request, res: Response) => {

    const item = req.body;

    models.Link.find(item)
    .then(result => {
        res.status(200).json({
            code: "y",
            data: result
        })
    })
    .catch(err => console.log("Link Find Err", err));
});

router.post("/linkUpdate", async (req: Request, res: Response) => {

    const item = req.body;

    await models.Link.findOne({_id: item._id})
    .then(async _update => {
        console.log(_update);
        if (_update === null) return;

        _update.updatedAt = new Date();
        _update.link = item.updateLink;
        _update.linkName = item.updateName;

        await _update.save();

        await models.Link.find({isDeleted: item.isDeleted})
        .then(result => {
            res.status(200).json({
                code: "y",
                data: result
            })
        })
        .catch(err => console.log("Link Update Err", err));
    })
    .catch(err => console.log("Link Update Err", err));
});


router.post("/linkDelete", async (req: Request, res: Response) => {

    const item = req.body;

    await models.Link.findOne(item)
    .then(async _delete => {
        if (_delete === null) return;

        _delete.updatedAt = new Date();
        _delete.isDeleted = true;

        await _delete.save();

        await models.Link.find({isDeleted: item.isDeleted})
        .then(result => {
            res.status(200).json({
                code: "y",
                data: result
            })
        })
        .catch(err => console.log("Link Find Err", err));
    })
    .catch(err => console.log("Link Delete Err", err));
});

router.post("/notifyFind", async (req: Request, res: Response) => {

    models.Notify.find({isDeleted: false})
    .limit(30)
    .then(result => {
        res.status(200).json({
            code: "y",
            data: result
        })
    })
    .catch(err => console.log("Notify Find Err", err));
});

router.post("/notifyConfirm", async (req: Request, res: Response) => {

    const item = req.body;

    models.Notify.findOne(item)
    .then(_update => {

        if (_update === null) return;

        _update.updatedAt = new Date();
        _update.confirm = true;

        _update.save();
        
    })
});

// router.post("/refresh", async (req: Request, res: Response) => {
    
//     console.log(req.body);
// });

export default router;