import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },

    contents:   String,
    secret:     Boolean,
    nick:       { type: String, default: "" },
});

export default mongoose.model("Guest", guestSchema);