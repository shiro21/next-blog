import express, { Request, Response, NextFunction } from "express";
import * as functions from "firebase-functions";
import "dotenv/config";

const app = express();

import cors from "cors";
app.use(cors({ origin: "*", credentials: true }));

app.use(function(req, res: Response, next) {
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    next();
});

import http from "http";
const server = http.createServer(app);

// import useragent from "express-useragent";
// import AgentData from "./service/userAgent";
// app.use(useragent.express());
// app.use(AgentData);




import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import cookieParser from "cookie-parser";
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/*', (req, res, next) => {
    if (req.body) req.body.isDeleted = { $ne: true };

    next();
});

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("양호");
});

// MongoDB Conn
import mongoose from "mongoose";
import { database } from "./config/conn";
mongoose.set("strictQuery", false);
mongoose.connect(database.path)
.then(() => {
    console.log("Mongoose Conn");
})
.catch(err => console.log("Mongoose Err", err));
mongoose.connection.on("error", (err) => {
    console.log("Mongoose Connection Err", err);
});
mongoose.connection.once("open", () => {
    console.log("MongoDB Connected");
});

// Router
import routes from "./config/routes";
app.use("/api", routes);

const PORT = process.env.NODE_PORT || 4002;

server.listen(PORT, () => {
    const message = `
        [ Shiro21 Blog Project ]
        Running PORT: localhost:${PORT}
    `;

    console.log(message);
});

export const api = functions.region("asia-northeast3").https.onRequest(app);
