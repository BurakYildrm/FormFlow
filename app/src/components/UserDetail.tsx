"use client";

import { selectUser, setUser, useAppDispatch, useAppSelector } from "@/store";
import { User } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import React, { useEffect, useState } from "react";
import UserNotFound from "./UserNotFound";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import { checkLogin, getUserById, logout, updateUserById } from "@/services";
import { set } from "lodash";

interface UserDetailProps {
	id: string;
}

const UserDetail: React.FC<UserDetailProps> = ({ id }) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const t = useTranslations("UserDetail");
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	const [openModal, setOpenModal] = useState<string | undefined>();
	const locale = useLocale();
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [photo, setPhoto] = useState<string>("");

	useEffect(() => {
		const init = async () => {
			const token = localStorage.getItem("token") ?? "";
			const [checkLoginResponse, userResponse] = await Promise.all([
				checkLogin(token),
				getUserById(token, id),
			]);

			if (
				checkLoginResponse.status === 401 ||
				userResponse.status === 401
			) {
				if (token) {
					logout(token);
					localStorage.removeItem("token");
				}
				dispatch(setUser(null));
				router.push("/login?auth=true");
				return;
			}

			const checkLoginData = checkLoginResponse.data;
			const userData =
				checkLoginData["user" as keyof typeof checkLoginData];
			dispatch(setUser(userData));

			if (userResponse.status === 403) {
				router.push("/not-authorized");
				return;
			}

			if (userResponse.status === 404) {
				setError(true);
				return;
			}

			const selectedUserData = userResponse.data;
			setSelectedUser(
				selectedUserData["user" as keyof typeof selectedUserData]
			);
			setLoading(false);
		};

		init();
	}, []);

	const updateUser = async () => {
		const token = localStorage.getItem("token")!;
		const response = await updateUserById(
			token,
			id,
			username,
			password,
			photo
		);

		if (response.status === 401) {
			logout(token);
			localStorage.removeItem("token");
			dispatch(setUser(null));
			router.push("/login?auth=true");
			return;
		}

		router.push("/users");
	};

	return (
		<>
			{error && <UserNotFound />}
			{!error && loading && (
				<span className="loading loading-infinity loading-lg"></span>
			)}
			{!error && !loading && (
				<div className="bg-base-100 w-full">
					<div className="py-6 px-4 mx-auto max-w-2xl lg:py-16">
						<h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
							{t("heading", { id })}
						</h2>
						<form>
							<div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
								<div className="sm:col-span-2">
									<label
										htmlFor="username"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("username")}
									</label>
									<input
										type="text"
										id="username"
										value={selectedUser?.username}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:focus:ring-accent dark:focus:border-accent"
									/>
								</div>
								<div className="sm:col-span-2">
									<label
										htmlFor="password"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("password")}
									</label>
									<input
										type="text"
										id="password"
										value={selectedUser?.password}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:focus:ring-accent dark:focus:border-accent"
									/>
								</div>
								<div>
									<label
										htmlFor="role"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("role")}
									</label>
									<input
										type="text"
										id="role"
										value={selectedUser?.role}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pointer-events-none"
										readOnly
									/>
								</div>
								<div className="sm:col-span-2">
									<label
										htmlFor="photo"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("photo")}
									</label>
									<input
										type="file"
										className="file-input file-input-bordered focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:placeholder-gray-400 dark:focus:ring-accent dark:focus:border-accent"
									/>
								</div>
							</div>
							{user?.role == "admin" && (
								<>
									<button
										type="button"
										className="btn btn-success dark:btn-success text-sm px-5 py-2.5 mt-4 sm:mt-6 sm:w-auto w-full"
										onClick={updateUser}
									>
										{t("update")}
									</button>
								</>
							)}
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default UserDetail;
