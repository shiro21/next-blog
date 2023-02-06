import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";

const app = express();

import cors from "cors";
app.use(cors({ origin: "*" }));

import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("양호");
});

// Router
import routes from "./config/routes";
app.use("/api", routes);

const PORT = process.env.NODE_PORT || 4000;
app.listen(PORT, () => {
    const message = `
        [ Shiro21 Blog Project ]
        Running PORT: localhost:${PORT}
    `;

    console.log(message);
});