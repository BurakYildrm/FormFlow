"use client";

import { useAppDispatch, useAppSelector } from "@/store";
import { selectMessages, setMessages } from "@/store";
import React, { useEffect, useState } from "react";
import { useRouter } from "next-intl/client";
import { setUser } from "@/store";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { checkLogin, getMessages, logout } from "@/services";
import { useTranslations } from "next-intl";
import { classNames } from "primereact/utils";

const MessagesList: React.FC = () => {
	const dispatch = useAppDispatch();
	const messages = useAppSelector(selectMessages);
	const [loading, setLoading] = useState<boolean>(true);
	const router = useRouter();
	const t = useTranslations("MessagesList");

	useEffect(() => {
		const init = async () => {
			const token = localStorage.getItem("token") ?? "";
			const [checkLoginResponse, messagesResponse] = await Promise.all([
				checkLogin(token),
				getMessages(token),
			]);

			if (
				checkLoginResponse.status === 401 ||
				messagesResponse.status === 401
			) {
				if (token) {
					logout(token);
					localStorage.removeItem("token");
				}
				dispatch(setUser(null));
				dispatch(setMessages(null));
				router.push("/login?auth=true");
				return;
			}

			const loginData = checkLoginResponse.data;
			const user = loginData["user" as keyof typeof loginData];
			dispatch(setUser(user));

			if (messagesResponse.status === 403) {
				dispatch(setMessages(null));
				router.push("/not-authorized");
				return;
			}

			const messagesData = messagesResponse.data;

			dispatch(
				setMessages(
					messagesData["messages" as keyof typeof messagesData]
				)
			);

			setLoading(false);
		};

		init();
	}, []);

	const onRowSelect = (event: DataTableRowClickEvent) => {
		router.push(`/message/${event.data.id}`);
	};

	return (
		<>
			{loading && (
				<div className="flex flex-col justify-center items-center">
					<span className="loading loading-infinity loading-lg"></span>
				</div>
			)}
			{!loading && (
				<>
					<div className="card">
						<DataTable
							value={messages!}
							removableSort
							paginator
							rows={5}
							rowsPerPageOptions={[5, 10, 25, 50]}
							onRowClick={onRowSelect}
							selectionMode="single"
							rowClassName={(data) => {
								return classNames(
									"!bg-base-100 dark:!bg-gray-600 !text-gray-900 dark:!text-white dark:hover:!bg-gray-500 group",
									{
										"not-read": !data.read,
									}
								);
							}}
							emptyMessage={() => (
								<p className="!bg-base-100 dark:!bg-gray-600 !text-gray-900 dark:!text-white dark:hover:!bg-gray-500 !-m-4 !-mb-[17px] !p-4 !box-border !border-gray-200 dark:!border-neutral !border-b">
									{t("noData")}
								</p>
							)}
							pt={{
								root: {
									className:
										"!shadow-lg !shadow-gray-200 dark:!shadow-gray-800 !rounded-2xl",
								},
								paginator: {
									root: {
										className:
											"!border-b-0 !rounded-b-2xl !bg-gray-50 dark:!bg-gray-700 !overflow-hidden ",
									},
								},
								wrapper: {
									className: "!rounded-t-2xl",
								},
							}}
						>
							<Column
								field="id"
								header={t("id")}
								sortable
								pt={{
									headerCell: {
										className:
											"!bg-gray-50 dark:!bg-gray-700 !border-gray-200 dark:!border-neutral",
									},
									headerContent: {
										className:
											"!text-gray-900 dark:!text-white",
									},
									sortIcon: {
										className:
											"!text-gray-900 dark:!text-white",
									},
									bodyCell: {
										className:
											"!border-gray-200 dark:!border-neutral group-[.not-read]:!font-medium",
									},
								}}
							></Column>
							<Column
								field="name"
								header={t("name")}
								sortable
								pt={{
									headerCell: {
										className:
											"!bg-gray-50 dark:!bg-gray-700 !border-gray-200 dark:!border-neutral",
									},
									headerContent: {
										className:
											"!text-gray-900 dark:!text-white",
									},
									sortIcon: {
										className:
											"!text-gray-900 dark:!text-white",
									},
									bodyCell: {
										className:
											"!border-gray-200 dark:!border-neutral group-[.not-read]:!font-medium",
									},
								}}
							></Column>
							<Column
								field="gender"
								header={t("gender")}
								sortable
								pt={{
									headerCell: {
										className:
											"!bg-gray-50 dark:!bg-gray-700 !border-gray-200 dark:!border-neutral",
									},
									headerContent: {
										className:
											"!text-gray-900 dark:!text-white",
									},
									sortIcon: {
										className:
											"!text-gray-900 dark:!text-white",
									},
									bodyCell: {
										className:
											"!border-gray-200 dark:!border-neutral group-[.not-read]:!font-medium",
									},
								}}
							></Column>
							<Column
								field="country"
								header={t("country")}
								sortable
								pt={{
									headerCell: {
										className:
											"!bg-gray-50 dark:!bg-gray-700 !border-gray-200 dark:!border-neutral",
									},
									headerContent: {
										className:
											"!text-gray-900 dark:!text-white",
									},
									sortIcon: {
										className:
											"!text-gray-900 dark:!text-white",
									},
									bodyCell: {
										className:
											"!border-gray-200 dark:!border-neutral group-[.not-read]:!font-medium",
									},
								}}
							></Column>
						</DataTable>
					</div>
				</>
			)}
		</>
	);
};

export default MessagesList;
