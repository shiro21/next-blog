import nodemailer from "nodemailer";
import "dotenv/config";


export const userEmail = (emailStr: string, randomCount: number) => {

    let options = {
        from: process.env.NODE_USER,
        to: emailStr,
        subject: "가입신청을 환영합니다.",
        html: `${randomCount} 입력해주세요.`
    }

    let transport = nodemailer.createTransport({
        host: process.env.NODE_EMAIL_HOST,
        service: "naver",
        auth: {
            user: process.env.NODE_USER,
            pass: process.env.NODE_PASSWORD
        }
    });

    transport.sendMail(options, function(err, info) {
        if (err) throw console.log(err);
    })
}