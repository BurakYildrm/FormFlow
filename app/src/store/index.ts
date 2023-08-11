import { configureStore } from "@reduxjs/toolkit";
import userReducer, { setUser, selectUser } from "./userSlice";
import messagesReducer, { setMessages, selectMessages } from "./messagesSlice";
import AppProvider from "./AppProvider";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

export const store = configureStore({
	reducer: {
		user: userReducer,
		messages: messagesReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export { setUser, selectUser, setMessages, selectMessages, AppProvider };
