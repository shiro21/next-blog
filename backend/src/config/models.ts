import userSchema from "../models/user";
import authSchema from "../models/auth";
import categorySchema from "../models/category";
import subCategorySchema from "../models/subCategory";
import writeSchema from "../models/write";
import likeSchema from "../models/like";
import commentSchema from "../models/comment";
import agentSchema from "../models/agent";

const models = {
    User: userSchema,
    Auth: authSchema,
    Category: categorySchema,
    SubCategory: subCategorySchema,
    Write: writeSchema,
    Like: likeSchema,
    Comment: commentSchema,
    Agent: agentSchema
}

export default models;