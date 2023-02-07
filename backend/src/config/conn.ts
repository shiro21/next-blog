import "dotenv/config";

export const database = {
    path: process.env.NODE_DATABASE || ""
};