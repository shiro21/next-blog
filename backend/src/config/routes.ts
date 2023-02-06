import express from "express";
const app = express();

import user from "../controllers/userController";

app.use("/user", user);

export default app;