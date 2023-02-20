import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    updatedAt:      Date,
    createdAt:      Date,

    write:          mongoose.Schema.Types.ObjectId,
    userAgent:      String,
    
});

export default mongoose.model("Agent", agentSchema);