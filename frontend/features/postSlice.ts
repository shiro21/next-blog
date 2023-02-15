import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { PostProps } from "@/pages/services/interface";

const initialState = {
    status: "idle",
    post: [] as PostProps[],
    error: null
}

export const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        postsList: (state, action: PayloadAction<PostProps[]>) => {
            state.status = "success";
            state.post = action.payload;
            // console.log(state.post)
            // console.log(action.payload)
        }
    },
    extraReducers: (builder) => {

    }
});

export const { postsList } = postSlice.actions;
export default postSlice.reducer;