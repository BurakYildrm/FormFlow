"use server";

import {
	CheckLoginResponse,
	ErrorResponse,
	LoginResponse,
	LogoutResponse,
	UserResponse,
	UsersResponse,
} from "@/types";

const checkLogin = async (token: string) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/user/check-login",
		{
			cache: "no-cache",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		}
	);

	const status = response.status;
	const body: CheckLoginResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as CheckLoginResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

const login = async (username: string, password: string, expiry: string) => {
	const response: Response = await fetch("/api/user/login", {
		cache: "no-cache",
		method: "POST",
		body: JSON.stringify({
			username: username,
			password: password,
			expiry: expiry,
		}),
	});

	const status = response.status;
	const body: LoginResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as LoginResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

const logout = async (token: string) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/user/logout",
		{
			cache: "no-cache",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		}
	);

	const status = response.status;
	const body: LogoutResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as LogoutResponse).data
			: (body as ErrorResponse).error;
};

const getUsers = async (token: string) => {
	const response: Response = await fetch("http://localhost:3000/api/users", {
		cache: "no-cache",
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			token: token,
		},
	});

	const status = response.status;
	const body: UsersResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as UsersResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

const getUserById = async (token: string, id: string) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/user/" + id,
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
	const body: UserResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as UserResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

const updateUserById = async (
	token: string,
	id: string,
	username: string,
	password: string,
	photo: string
) => {
	const response: Response = await fetch(
		"http://localhost:3000/api/user/update/" + id,
		{
			cache: "no-cache",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
			body: JSON.stringify({
				username: username,
				password: password,
				base64Photo: photo,
			}),
		}
	);

	const status = response.status;
	const body: UserResponse | ErrorResponse = await response.json();
	const data =
		status === 200
			? (body as UserResponse).data
			: (body as ErrorResponse).error;

	return {
		status: status,
		data: data,
	};
};

export { login, checkLogin, logout, getUsers, getUserById, updateUserById };
