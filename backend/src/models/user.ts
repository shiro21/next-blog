import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },

    id:         String,
    email:      String,
    type:       String,
    role:       String,
    roleLabel:  String,
    name:       String,
    profile:    String,
    subscribe:  { type: String, default: "" }
});

export default mongoose.model("User", userSchema);