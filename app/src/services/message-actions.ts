"use server";

import {
	DeleteMessageResponse,
	ErrorResponse,
	MessageResponse,
	MessagesResponse,
} from "@/types";

const addMessage = async (
	name: string,
	message: string,
	gender: string,
	country: string
) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/message/add",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: name,
				message: message,
				gender: gender,
				country: country,
			}),
		}
	);

	const status = response.status;
	const body: MessageResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as MessageResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

const getMessages = async (token: string) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/messages",
		{
			cache: "no-cache",
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		}
	);

	const status = response.status;
	const body: MessagesResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as MessagesResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

const getMessageById = async (token: string, id: string) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/message/" + id,
		{
			cache: "no-cache",
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		}
	);

	const status = response.status;
	const body: MessageResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as MessageResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

const readMessageById = async (token: string, id: string) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/message/read/" + id,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		}
	);

	const status = response.status;
	const body: MessageResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as MessageResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

const deleteMessageById = async (token: string, id: string) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/message/delete/" + id,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		}
	);

	const status = response.status;
	const body: DeleteMessageResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as DeleteMessageResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

export {
	addMessage,
	getMessages,
	getMessageById,
	readMessageById,
	deleteMessageById,
};
