import userSchema from "../models/user";
import authSchema from "../models/auth";
import categorySchema from "../models/category";
import subCategorySchema from "../models/subCategory";
import writeSchema from "../models/write";
import likeSchema from "../models/like";
import commentSchema from "../models/comment";
import agentSchema from "../models/agent";
import linkSchema from "../models/link";
import guestSchema from "../models/guest";
import notifySchema from "../models/notify";

const models = {
    User: userSchema,
    Auth: authSchema,
    Category: categorySchema,
    SubCategory: subCategorySchema,
    Write: writeSchema,
    Like: likeSchema,
    Comment: commentSchema,
    Agent: agentSchema,
    Link: linkSchema,
    Guest: guestSchema,
    Notify: notifySchema
}

export default models;