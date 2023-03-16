import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LinkProps } from "@/services/interface";

const initialState = {
    status: "idle",
    link: [] as LinkProps[],
    error: null
}

export const linkSlice = createSlice({
    name: "link",
    initialState,
    reducers: {
        linksList: (state, action: PayloadAction<LinkProps[]>) => {
            state.status = "success";
            state.link = action.payload;
        }
    },
    extraReducers: (builder) => {

    }
});

export const { linksList } = linkSlice.actions;
export default linkSlice.reducer;