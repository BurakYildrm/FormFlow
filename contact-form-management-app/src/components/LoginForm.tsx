"use client";

import React, { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setUser, User } from "@/store/userSlice";
import { useTranslations } from "next-intl";
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

export interface LoginError {
	error: string;
}

const LoginForm: React.FC = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [username, setUsername] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [rememberMe, setRememberMe] = React.useState<boolean>(false);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string>("");
	const usernameInput = React.useRef<HTMLInputElement>(null);
	const passwordInput = React.useRef<HTMLInputElement>(null);
	const t = useTranslations("LoginForm");

	useEffect(() => {
		const checkLogin = async (token: string) => {
			if (token === "") {
				setLoading(false);
				return;
			}

			const response: CheckLoginResponse | LoginError = await (
				await fetch("/api/user/check-login", {
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
				//alert(response.error);
				fetch("/api/user/logout", {
					cache: "no-cache",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: token,
					},
				});

				localStorage.removeItem("token");
				return;
			}

			router.push("/");
		};

		checkLogin(localStorage.getItem("token") ?? "");
	}, []);

	const login = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		usernameInput.current?.classList.remove("invalid");
		passwordInput.current?.classList.remove("invalid");

		const response: LoginResponse | LoginError = await (
			await fetch("/api/user/login", {
				cache: "no-cache",
				method: "POST",
				body: JSON.stringify({
					username: username,
					password: password,
					expiry: rememberMe ? "1d" : "10m",
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

		localStorage.setItem("token", token);
		dispatch(setUser(user));
		router.push("/");
	};

	return (
		<>
			{loading && (
				<span className="loading loading-infinity loading-lg"></span>
			)}
			{!loading && (
				<div className="bg-base-100 p-10 rounded">
					<form className="flex flex-col" onSubmit={login} noValidate>
						<div className="mb-6">
							<label
								htmlFor="username"
								className="mb-2 text-sm font-medium text-gray-900 dark:text-white"
							>
								{t("username")}
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
								placeholder={t("usernamePlaceholder")}
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
								{t("password")}
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
								placeholder={t("passwordPlaceholder")}
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
								{t("rememberMe")}
							</label>
						</div>
						<button
							type="submit"
							className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
						>
							{t("submit")}
						</button>
					</form>
				</div>
			)}
		</>
	);
};

export default LoginForm;
