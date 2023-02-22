import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default (req: NextApiRequest, res: NextApiResponse) => {
	const expired = new Date();
	expired.setTime(expired.getTime() + 60 * 60);

    console.log(expired);
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("@nextjs-blog-token", req.body.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            // maxAge: 60 * 60,
            expires: expired,
            sameSite: "strict",
            path: "/"
        })
    );
    res.status(200).json({ success: true });
};