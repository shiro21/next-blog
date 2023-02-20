import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },

    nick:       String,
    password:   String,
    comment:    String,
    secret:     Boolean,
    owner:      { type: mongoose.Schema.Types.ObjectId, ref: "Write" },
});

export default mongoose.model("Comment", commentSchema);