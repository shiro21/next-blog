import mongoose from "mongoose";

/*
    name: 카테고리 이름, label: 카테고리 이름, priority: 우선순위( 정렬순서 ),
    entries: 생성된 글 갯수, depth: 카테고리 단계( 1 ), parent: 부모 ( 0 ),
    categoryInfo: { image: 이미지, description: 설명 }, opened: 보임 / 숨김,
    updateData: 새로운 글 표시, leaf: 자식의 유무
*/
const categorySchema = new mongoose.Schema({
    _id:        mongoose.Schema.Types.ObjectId,
    createdAt:  Date,
    updatedAt:  Date,
    isDeleted:  { type: Boolean, default: false },

    name:       String,
    label:      String,
    priority:   Number,
    entries:    Number,
    depth:      Number,
    categoryInfo: {
        image: String,
        description: String
    },
    opened:     Boolean,
    updateData: Boolean,
    leaf:       Boolean,
    children:   Array
});

export default mongoose.model("Category", categorySchema);