import express from "express";
const app = express();

import user from "../controllers/userController";
import edit from "../controllers/editController";
import total from "../controllers/totalController";
import like from "../controllers/likeController";
import test from "../controllers/testController";

app.use("/user", user);
app.use("/edit", edit);
app.use("/total", total);
app.use("/like", like);
app.use("/test", test);

export default app;