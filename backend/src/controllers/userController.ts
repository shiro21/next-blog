import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import models from "../config/models";
import { crypto, mongoose, jwt } from "../config/plugins";
import { userEmail } from "../service/emailService";
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

export default router;