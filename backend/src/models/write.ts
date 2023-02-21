import mongoose from "mongoose";

const writeSchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },

    title:      String,
    edit:       String,
    tag:        Array,
    category:   { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory:{ type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    coverImage: String,
    label:      String,
    subLabel:   String,
    owner:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    count:      { type: Number, default: 0 }
});

export default mongoose.model("Write", writeSchema);