import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserProps } from "@/pages/services/interface";

const initialState = {
    status: "idle",
    user: {} as UserProps,
    error: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userList: (state, action: PayloadAction<UserProps>) => {
            if (action.payload) state.status = "success";
            else state.status = "idle";
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {

    }
});

export const { userList } = userSlice.actions;
export default userSlice.reducer;