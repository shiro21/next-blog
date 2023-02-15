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
            console.log(action.payload);
            if (!action.payload._id) state.status = "idle";
            else state.status = "success";
            
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {

    }
});

export const { userList } = userSlice.actions;
export default userSlice.reducer;