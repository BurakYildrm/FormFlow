"use client";

import React, { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setUser, User } from "@/store/userSlice";
export interface LoginResponse {
	data: {
		token: string;
		user: User;
	};
}

export interface LoginError {
	error: string;
}

const LoginForm = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [username, setUsername] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [rememberMe, setRememberMe] = React.useState<boolean>(
		localStorage.getItem("token") ? true : false
	);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string>("");
	const usernameInput = React.useRef<HTMLInputElement>(null);
	const passwordInput = React.useRef<HTMLInputElement>(null);

	useEffect(() => {
		const checkLogin = async (token: string) => {
			if (token === "") {
				setLoading(false);
				return;
			}

			const response = await (
				await fetch("/api/check-login", {
					cache: "no-cache",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: token,
					},
				})
			).json();

			if ("error" in response) {
				dispatch(setUser(null));
				setUsername("");
				setPassword("");
				setLoading(false);
				alert(response.error);
				fetch("/api/logout", {
					cache: "no-cache",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: token,
					},
				});

				if (rememberMe) {
					localStorage.removeItem("token");
				} else {
					sessionStorage.removeItem("token");
				}

				return;
			}

			router.push("/");
		};

		checkLogin(
			rememberMe
				? localStorage.getItem("token") ?? ""
				: sessionStorage.getItem("token") ?? ""
		);
	}, []);

	const login = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		usernameInput.current?.classList.remove("invalid");
		passwordInput.current?.classList.remove("invalid");

		const response: LoginResponse | LoginError = await (
			await fetch("/api/login", {
				cache: "no-cache",
				method: "POST",
				body: JSON.stringify({
					username: username,
					password: password,
				}),
			})
		).json();

		if ("error" in response) {
			setError(response.error);
			if (response.error.includes("Username")) {
				usernameInput.current?.classList.add("invalid");
			}

			if (response.error.includes("Password")) {
				passwordInput.current?.classList.add("invalid");
			}
			return;
		}

		const data = (response as LoginResponse).data;
		const user = data.user;
		const token = data.token;

		if (rememberMe && token) {
			localStorage.setItem("token", token);
		}

		if (!rememberMe && token) {
			sessionStorage.setItem("token", token);
		}

		dispatch(setUser(user));
		router.push("/");
	};

	return (
		<>
			{loading && (
				<div className="text-center">
					<div role="status">
						<svg
							aria-hidden="true"
							className="inline w-10 h-10 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only">Loading...</span>
					</div>
				</div>
			)}
			{!loading && (
				<div className="bg-base-200 p-10 rounded">
					<form className="flex flex-col" onSubmit={login} noValidate>
						<div className="mb-6">
							<label
								htmlFor="username"
								className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Username
							</label>
							<input
								type="text"
								id="username"
								name="username"
								value={username}
								onChange={(e) => {
									setUsername(e.target.value);
									e.target.classList.remove("invalid");
								}}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 [&.invalid]:text-red-600 [&.invalid]:border-red-500 [&.invalid]:focus:border-red-500 [&.invalid]:focus:ring-red-500 peer/username"
								placeholder="username"
								autoComplete="off"
								ref={usernameInput}
								required
							/>
							<div className="peer-[.invalid]/username:block hidden text-sm text-red-600">
								{error}
							</div>
						</div>
						<div className="mb-6">
							<label
								htmlFor="password"
								className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								value={password}
								ref={passwordInput}
								onChange={(e) => {
									setPassword(e.target.value);
									e.target.classList.remove("invalid");
								}}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 [&.invalid]:text-red-600 [&.invalid]:border-red-500 [&.invalid]:focus:border-red-500 [&.invalid]:focus:ring-red-500 peer/password"
								placeholder="password"
								required
							/>
							<div className="peer-[.invalid]/password:block hidden text-sm text-red-600">
								{error}
							</div>
						</div>
						<div className="flex items-start mb-6">
							<div className="flex items-center h-5">
								<input
									id="remember"
									type="checkbox"
									name="remember-me"
									checked={rememberMe}
									onChange={(e) =>
										setRememberMe(e.target.checked)
									}
									className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
								/>
							</div>
							<label
								htmlFor="remember"
								className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>
								Remember me
							</label>
						</div>
						<button
							type="submit"
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							Submit
						</button>
					</form>
				</div>
			)}
		</>
	);
};

export default LoginForm;
