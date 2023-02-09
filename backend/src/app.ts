import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";

const app = express();

import http from "http";
const server = http.createServer(app);

import cors from "cors";
app.use(cors({ origin: "*" }));

import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

import cookieParser from "cookie-parser";
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("양호");
    console.log(req.cookies);
});

// import * as functions from 'firebase-functions';

// export const helloWorld = functions.https.onRequest((req, resp) => {
//  resp.send("Hello from Firebase!");
// });

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

const PORT = process.env.NODE_PORT || 4000;

server.listen(PORT, () => {
    const message = `
        [ Shiro21 Blog Project ]
        Running PORT: localhost:${PORT}
    `;

    console.log(message);
});
// app.listen(PORT, () => {
//     const message = `
//         [ Shiro21 Blog Project ]
//         Running PORT: localhost:${PORT}
//     `;

//     console.log(message);
// });