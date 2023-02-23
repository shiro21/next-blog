import mongoose from "mongoose";

const notifySchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },
    
    nick:       String,
    owner:      { type: mongoose.Schema.Types.ObjectId, ref: "Write" },
    comment:    String,
    confirm:    { type: Boolean, default: false }
});

export default mongoose.model("Notify", notifySchema);