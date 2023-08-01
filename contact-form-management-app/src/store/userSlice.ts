import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";

export interface User {
	id: number;
	username: string;
	password: string;
	role: string;
	base64Photo: string;
}

interface UserState {
	value: User | null;
}

const initialState: UserState = {
	value: null,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User | null>) => {
			state.value = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.value;
export default userSlice.reducer;
