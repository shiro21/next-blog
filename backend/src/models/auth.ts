import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },

    owner:      mongoose.Schema.Types.ObjectId,
    passport:   String,
    salt:       String
});

export default mongoose.model("Auth", authSchema);