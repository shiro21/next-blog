import mongoose from "mongoose";

const agentSchema = new mongoose.Schema({
    _id:            mongoose.Schema.Types.ObjectId,
    updatedAt:      Date,
    createdAt:      Date,

    write:          { type: mongoose.Schema.Types.ObjectId, ref: "Write" },
    userAgent:      String,
    
});

export default mongoose.model("Agent", agentSchema);