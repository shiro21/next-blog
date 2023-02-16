import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },

    name:       String,
    write:      { type: mongoose.Schema.Types.ObjectId, ref: "Write" }
});

export default mongoose.model("Like", likeSchema);