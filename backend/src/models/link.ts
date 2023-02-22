import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },
    
    link:       String,
    linkName:   String
});

export default mongoose.model("Link", linkSchema);