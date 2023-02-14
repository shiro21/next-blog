import mongoose from "mongoose";

const writeSchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },

    title:      String,
    edit:       String,
    tag:        Array,
    category:   Array,
    coverImage: String,
    label:      String
});

export default mongoose.model("Write", writeSchema);