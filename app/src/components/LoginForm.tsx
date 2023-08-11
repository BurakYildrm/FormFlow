"use client";

import React, { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Alert } from ".";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { HiUser, HiLockClosed } from "react-icons/hi2";
import {
	CheckLoginResponse,
	ErrorResponse,
	LoginResponse,
	User,
} from "@/types";

const LoginForm: React.FC = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();
	const isAuth = searchParams.get("auth") === "true";
	const [alert, setAlert] = React.useState<boolean>(isAuth);
	const [alertType, setAlertType] = React.useState<string>(
		isAuth ? "error" : ""
	);
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
				dispatch(setUser(null));
				setLoading(false);
				return;
			}

			/*const response: CheckLoginResponse | LoginError = await (
				await fetch("/api/user/check-login", {
					cache: "no-cache",
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						token: token,
					},
				})
			).json();*/

			const response: Response = await fetch("/api/user/check-login", {
				cache: "no-cache",
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: token,
				},
			});

			const status: number = response.status;

			if (status === 401) {
				dispatch(setUser(null));
				setUsername("");
				setPassword("");
				setLoading(false);
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

			const responseBody: CheckLoginResponse = await response.json();
			const user = responseBody.data.user;
			dispatch(setUser(user));
			router.push("/");
		};

		checkLogin(localStorage.getItem("token") ?? "");
	}, []);

	const login = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		usernameInput.current?.classList.remove("invalid", "empty");
		passwordInput.current?.classList.remove("invalid", "empty");
		let check = 0;

		/*const response: LoginResponse | LoginError = await (
			await fetch("/api/user/login", {
				cache: "no-cache",
				method: "POST",
				body: JSON.stringify({
					username: username,
					password: password,
					expiry: rememberMe ? "1d" : "10m",
				}),
			})
		).json();*/

		if (!username) {
			usernameInput.current?.classList.add("empty", "error");
			check++;
		}

		if (!password) {
			passwordInput.current?.classList.add("empty", "error");
			check++;
		}

		if (check > 0) {
			return;
		}

		const response: Response = await fetch("/api/user/login", {
			cache: "no-cache",
			method: "POST",
			body: JSON.stringify({
				username: username,
				password: password,
				expiry: rememberMe ? "1d" : "10m",
			}),
		});

		const status: number = response.status;

		if (status === 401) {
			const responseBody: ErrorResponse = await response.json();
			setError(responseBody.error);

			if (responseBody.error.includes("Username")) {
				usernameInput.current?.classList.add("invalid");
			}

			if (responseBody.error.includes("Password")) {
				passwordInput.current?.classList.add("invalid");
			}
			return;
		}

		const responseBody: LoginResponse = await response.json();
		const data = responseBody.data;
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
				<div className="w-full">
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
									e.target.classList.remove(
										"invalid",
										"empty"
									);
								}}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent dark:focus:border-accent peer/username [&.error]:text-error [&.error]:border-error [&.error]:focus:border-error [&.error]:focus:ring-error"
								placeholder={t("usernamePlaceholder")}
								autoComplete="off"
								ref={usernameInput}
								required
							/>
							<div className="peer-[.empty]/username:block hidden text-sm text-error mt-1">
								{t("emptyUsernameError")}
							</div>
							<div className="peer-[.invalid]/username:block hidden text-sm text-error mt-1">
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
									e.target.classList.remove(
										"invalid",
										"empty"
									);
								}}
								className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent dark:focus:border-accent peer/password [&.error]:text-error [&.error]:border-error [&.error]:focus:border-error [&.error]:focus:ring-error"
								placeholder={t("passwordPlaceholder")}
								required
							/>
							<div className="peer-[.empty]/password:block hidden text-sm text-error mt-1">
								{t("emptyPasswordError")}
							</div>
							<div className="peer-[.invalid]/password:block hidden text-sm text-error mt-1">
								{error}
							</div>
						</div>
						<div className="mb-6 w-fit">
							{/* <div className="flex items-center h-5">
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
							</label> */}
							<div className="form-control">
								<label className="cursor-pointer label justify-start pl-0">
									<input
										id="remember"
										type="checkbox"
										name="remember-me"
										checked={rememberMe}
										onChange={(e) =>
											setRememberMe(e.target.checked)
										}
										className="checkbox checkbox-primary dark:checkbox-accent mr-2 focus:ring-1 focus:ring-primary dark:focus:ring-accent border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
									/>
									<span className="label-text">
										Remember me
									</span>
								</label>
							</div>
						</div>
						<button
							type="submit"
							className="btn btn-primary dark:btn-accent text-sm px-5 py-2.5 mt-4 sm:mt-6"
						>
							{t("submit")}
						</button>
					</form>
					{/* <form className="flex flex-col gap-4" noValidate>
						<div>
							<div className="mb-2 block">
								<Label htmlFor="email1" value="Your email" />
							</div>
							<TextInput
								icon={HiUser}
								id="email1"
								placeholder="name@flowbite.com"
								required
								type="email"
							/>
						</div>
						<div>
							<div className="mb-2 block">
								<Label
									htmlFor="password1"
									value="Your password"
								/>
							</div>
							<TextInput
								icon={HiLockClosed}
								id="password1"
								required
								type="password"
							/>
						</div>
						<div className="flex items-center gap-2">
							<Checkbox id="remember" />
							<Label htmlFor="remember">Remember me</Label>
						</div>
						<button
							type="submit"
							className="btn btn-primary dark:btn-accent text-sm px-5 py-2.5 mt-4 sm:mt-6 sm:w-auto w-full"
						>
							{t("submit")}
						</button>
					</form> */}
					{alert && (
						<div
							style={{
								animation: "fadeOut 3s ease-in-out forwards",
							}}
							onAnimationEnd={(e) => {
								e.currentTarget.classList.add("hidden");
								setAlert(false);
							}}
							className="w-full sm:w-fit mx-auto mt-4 sm:mt-6"
						>
							<Alert
								type={alertType}
								message={t(isAuth ? "authenticate" : alertType)}
							/>
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default LoginForm;
