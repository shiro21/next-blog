import userSchema from "../models/user";
import authSchema from "../models/auth";
import categorySchema from "../models/category";
import subCategorySchema from "../models/subCategory";

const models = {
    User: userSchema,
    Auth: authSchema,
    Category: categorySchema,
    SubCategory: subCategorySchema
}

export default models;