// new Date().getTime() + Math.random()

// children: [
//     {
//         _id:        mongoose.Schema.Types.ObjectId,
//         createdAt:  Date,
//         updatedAt:  Date,
//         isDeleted:  { type: Boolean, default: false },

//         name:       String,
//         label:      String,
//         priority:   Number,
//         entries:    Number,
//         depth:      Number,
//         parent:     Number,
//         opened:     Boolean,
//         updateData: Boolean,
//         leaf:       Boolean,
//         categoryInfo: {
//             image: String,
//             description: String
//         },
//     }
// ]

import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import models from "../config/models";
import { crypto, mongoose, jwt } from "../config/plugins";
const router = express.Router();

router.post("/")