import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import postReducer from "@/features/postSlice";
import categoryReducer from "@/features/categorySlice";
import userReducer from "@/features/userSlice";

// Slice

export const store = configureStore({
    reducer: {
        post: postReducer,
        category: categoryReducer,
        user: userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 일반적인 useDispatch와 useSelector대신 App전체에 사용
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;