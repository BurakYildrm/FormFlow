export interface User {
	id: number;
	username: string;
	password: string;
	role: string;
	base64Photo: string;
}

export interface Message {
	id: number;
	name: string;
	message: string;
	gender: string;
	country: string;
	read: boolean;
	creationDate: Date;
}

export interface ErrorResponse {
	error: string;
}

export interface MessagesResponse {
	data: {
		messages: Message[];
	};
}

export interface MessageResponse {
	data: {
		message: Message;
	};
}

export interface LoginResponse {
	data: {
		token: string;
		user: User;
	};
}

export interface CheckLoginResponse {
	data: {
		user: User;
	};
}

export interface LogoutResponse {
	data: {
		message: string;
	};
}

export interface DeleteMessageResponse {
	data: {
		message: {
			id: string;
		};
	};
}

export interface UsersResponse {
	data: {
		users: User[];
	};
}

export const ErrorMessages = {
	notAuthenticated: "User is not authenticated",
	noUsername: "Username is required",
	noPassword: "Password is required",
	wrongUsername: "Username does not exist",
	wrongPassword: "Password is incorrect",
	noToken: "Token is required",
	invalidToken: "Token is invalid",
	noUser: "User does not exist",
	noName: "Name is required",
	noMessage: "Message is required",
	noGender: "Gender is required",
	noCountry: "Country is required",
	messageNotFound: "Message not found",
	noPhoto: "Photo is required",
	alreadyExists: "Username already exists",
	userNotFound: "User not found",
};
