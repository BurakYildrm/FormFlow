import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import { Message } from "@/types";

interface MessagesState {
	value: Message[] | null;
}

const initialState: MessagesState = {
	value: null,
};

export const messagesSlice = createSlice({
	name: "messages",
	initialState,
	reducers: {
		setMessages: (state, action: PayloadAction<Message[] | null>) => {
			state.value = action.payload;
		},

		deleteMessage: (state, action: PayloadAction<number>) => {
			state.value =
				state.value?.filter(
					(message) => message.id !== action.payload
				) || null;
		},

		readMessage: (state, action: PayloadAction<number>) => {
			state.value =
				state.value?.map((message) => {
					if (message.id === action.payload) {
						message.read = true;
					}
					return message;
				}) || null;
		},
	},
});

export const { setMessages, deleteMessage, readMessage } =
	messagesSlice.actions;
export const selectMessages = (state: RootState) => state.messages.value;
export default messagesSlice.reducer;
