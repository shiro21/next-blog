import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import { mongoose, nodemailer } from "../config/plugins";
import { userEmail } from "../service/emailService";
const router = express.Router();

router.post("/emailConfirm", (req: Request, res: Response) => {

    const { email } = req.body;
    let randomCount = Math.floor(Math.random() * 10000);

    userEmail(email, randomCount);
    
    res.status(200).json({
        code: "y",
        data: randomCount
    })
});

router.post("/create", (req: Request, res: Response) => {

    const item = req.body;

    // 여기서부터 시작
    console.log(item);
})

export default router;