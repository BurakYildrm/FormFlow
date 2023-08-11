"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
	checkLogin,
	deleteMessageById,
	getMessageById,
	logout,
	readMessageById,
} from "@/services";
import { selectUser, setUser, useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next-intl/client";
import { Message } from "@/types";
import MessageNotFound from "./MessageNotFound";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi2";

interface MessageDetailProps {
	id: string;
}

const MessageDetail: React.FC<MessageDetailProps> = ({ id }) => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const t = useTranslations("MessageDetail");
	const [message, setMessage] = useState<Message | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<boolean>(false);
	const [openModal, setOpenModal] = useState<string | undefined>();
	const locale = useLocale();

	useEffect(() => {
		const init = async () => {
			const token = localStorage.getItem("token") ?? "";
			const [checkLoginResponse, messageResponse] = await Promise.all([
				checkLogin(token),
				getMessageById(token, id),
			]);

			if (
				checkLoginResponse.status === 401 ||
				messageResponse.status === 401
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

			if (messageResponse.status === 403) {
				router.push("/not-authorized");
				return;
			}

			if (messageResponse.status === 404) {
				setError(true);
				return;
			}

			const messageData = messageResponse.data;
			const actualMessage: Message =
				messageData["message" as keyof typeof messageData];
			setMessage(actualMessage);
			readMessageById(token, id);
			setLoading(false);
		};

		init();
	}, []);

	const deleteMessage = async () => {
		const token = localStorage.getItem("token")!;
		const response = await deleteMessageById(token, id);

		if (response.status === 401) {
			logout(token);
			localStorage.removeItem("token");
			dispatch(setUser(null));
			router.push("/login?auth=true");
			return;
		}

		router.push("/messages");
	};
	return (
		<>
			{error && <MessageNotFound />}
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
										htmlFor="name"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("name")}
									</label>
									<input
										type="text"
										id="name"
										value={message?.name}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pointer-events-none"
										readOnly
									/>
								</div>
								<div>
									<label
										htmlFor="gender"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("gender")}
									</label>
									<input
										type="text"
										id="gender"
										value={message?.gender}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pointer-events-none"
										readOnly
									/>
								</div>
								<div>
									<label
										htmlFor="country"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("country")}
									</label>
									<input
										type="text"
										id="country"
										value={message?.country}
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pointer-events-none"
										readOnly
									/>
								</div>
								<div className="sm:col-span-2">
									<label
										htmlFor="date"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("date")}
									</label>
									<input
										id="date"
										value={new Intl.DateTimeFormat(locale, {
											dateStyle: "medium",
											timeStyle: "medium",
										}).format(
											new Date(message?.creationDate!)
										)}
										className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pointer-events-none"
										readOnly
									></input>
								</div>
								<div className="sm:col-span-2">
									<label
										htmlFor="message"
										className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
									>
										{t("message")}
									</label>
									<textarea
										id="message"
										value={message?.message}
										rows={6}
										className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white pointer-events-none"
										style={{ resize: "none" }}
										readOnly
									></textarea>
								</div>
							</div>
							{user?.role == "admin" && (
								<>
									<button
										type="button"
										className="btn btn-error dark:btn-error text-sm px-5 py-2.5 mt-4 sm:mt-6 sm:w-auto w-full"
										onClick={() => setOpenModal("pop-up")}
									>
										{t("delete")}
									</button>
									<Modal
										show={openModal === "pop-up"}
										size="md"
										popup
										onClose={() => setOpenModal(undefined)}
									>
										<Modal.Header />
										<Modal.Body>
											<div className="text-center">
												<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
												<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
													{t("deleteConfirm")}
												</h3>
												<div className="flex justify-center gap-4">
													<Button
														color="failure"
														onClick={() => {
															setOpenModal(
																undefined
															);
															deleteMessage();
														}}
													>
														{t("confirm")}
													</Button>
													<Button
														color="gray"
														onClick={() =>
															setOpenModal(
																undefined
															)
														}
													>
														{t("cancel")}
													</Button>
												</div>
											</div>
										</Modal.Body>
									</Modal>
								</>
							)}
						</form>
					</div>
				</div>
			)}
		</>
	);
};

export default MessageDetail;
