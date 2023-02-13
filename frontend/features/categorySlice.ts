import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CategoryProps } from "@/pages/services/interface";

const initialState = {
    status: "idle",
    category: [] as CategoryProps[],
    error: null
}

export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        categoriesList: (state, action: PayloadAction<CategoryProps[]>) => {
            state.category = action.payload
        }
    },
    extraReducers: (builder) => {

    }
});

export const { categoriesList } = categorySlice.actions;
export default categorySlice.reducer;