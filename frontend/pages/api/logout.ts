import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

 const logout = (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader(
        "Set-Cookie",
        cookie.serialize("@nextjs-blog-token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            expires: new Date(0),
            sameSite: "strict",
            path: "/"
        })
    );
    res.status(200).json({ success: true });
};

export default logout;