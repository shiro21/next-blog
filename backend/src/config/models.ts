import userSchema from "../models/user";
import authSchema from "../models/auth";
import categorySchema from "../models/category";
import subCategorySchema from "../models/subCategory";
import writeSchema from "../models/write";
import likeSchema from "../models/like";

const models = {
    User: userSchema,
    Auth: authSchema,
    Category: categorySchema,
    SubCategory: subCategorySchema,
    Write: writeSchema,
    Like: likeSchema
}

export default models;