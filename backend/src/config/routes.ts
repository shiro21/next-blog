import express from "express";
const app = express();

import user from "../controllers/userController";
import edit from "../controllers/editController";

app.use("/user", user);
app.use("/edit", edit);

export default app;