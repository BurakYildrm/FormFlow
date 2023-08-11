"use client";

import React, { useEffect, useState } from "react";
import { checkLogin, getUsers, logout } from "@/services";
import { useTranslations } from "next-intl";
import { DataTable, DataTableRowClickEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next-intl/client";
import { setUser } from "@/store";
import { useAppDispatch } from "@/store";
import { User } from "@/types";

const UsersList = () => {
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState<boolean>(true);
	const [users, setUsers] = useState<User[] | null>(null);
	const router = useRouter();
	const t = useTranslations("UsersList");

	useEffect(() => {
		const init = async () => {
			const token = localStorage.getItem("token") ?? "";
			const [checkLoginResponse, usersResponse] = await Promise.all([
				checkLogin(token),
				getUsers(token),
			]);

			if (
				checkLoginResponse.status === 401 ||
				usersResponse.status === 401
			) {
				if (token) {
					logout(token);
					localStorage.removeItem("token");
				}
				dispatch(setUser(null));
				router.push("/login?auth=true");
				return;
			}

			const loginData = checkLoginResponse.data;
			const user = loginData["user" as keyof typeof loginData];
			dispatch(setUser(user));

			if (usersResponse.status === 403) {
				router.push("/not-authorized");
				return;
			}

			const usersData = usersResponse.data;

			setUsers(usersData["users" as keyof typeof usersData]);
			setLoading(false);
		};

		init();
	}, []);

	const onRowSelect = (event: DataTableRowClickEvent) => {
		router.push(`/user/${event.data.id}`);
	};

	const usernameBodyTemplate = (rowData: User) => {
		return (
			<div className="flex align-items-center gap-2">
				<img
					alt={rowData.username}
					src={rowData.base64Photo}
					width="32"
				/>
				<span>{rowData.username}</span>
			</div>
		);
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
							value={users!}
							removableSort
							paginator
							rows={5}
							rowsPerPageOptions={[5, 10, 25, 50]}
							onRowClick={onRowSelect}
							selectionMode="single"
							rowClassName={() =>
								"!bg-base-100 dark:!bg-gray-600 !text-gray-900 dark:!text-white dark:hover:!bg-gray-500"
							}
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
											"!border-gray-200 dark:!border-neutral",
									},
								}}
							></Column>
							<Column
								field="name"
								header={t("username")}
								body={usernameBodyTemplate}
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
											"!border-gray-200 dark:!border-neutral",
									},
								}}
							></Column>
							<Column
								field="password"
								header={t("password")}
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
											"!border-gray-200 dark:!border-neutral",
									},
								}}
							></Column>
							<Column
								field="role"
								header={t("role")}
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
											"!border-gray-200 dark:!border-neutral",
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

export default UsersList;
