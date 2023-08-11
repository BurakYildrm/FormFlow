"use client";

import React, { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { Bungee } from "next/font/google";
import { setCookie, getCookie } from "cookies-next";
import { usePathname, useRouter } from "next-intl/client";
import Link from "next-intl/link";
import { useLocale, useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectUser, setUser } from "@/store";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import {
	HiOutlineDocumentChartBar,
	HiOutlineUserGroup,
	HiOutlineInbox,
	HiArrowRightOnRectangle,
	HiOutlineArrowLeftOnRectangle,
} from "react-icons/hi2";
import Image from "next/image";
import FlagIcon from "./FlagIcon";
import { Skeleton } from "primereact/skeleton";
import { logout } from "@/services";

const bungee = Bungee({ subsets: ["latin"], weight: ["400"] });

const CustomNavbar: React.FC = () => {
	const [theme, setTheme] = useState<string>(
		(getCookie("theme") ?? "dark") as string
	);
	const [loading, setLoading] = useState<boolean>(true);
	const checked = theme === "dark";
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const locale = useLocale();
	const t = useTranslations("Navbar");
	const router = useRouter();

	useEffect(() => {
		setCookie("theme", theme);
		const localTheme = getCookie("theme") as string;
		document.documentElement.setAttribute("data-theme", localTheme);
	}, [theme]);

	useEffect(() => {
		setLoading(false);
	}, []);

	const changeTheme = (e: ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		if (target.checked) {
			setTheme("dark");
		} else {
			setTheme("light");
		}
	};

	const handleLogout = async () => {
		const token = localStorage.getItem("token");
		await logout(token!);
		localStorage.removeItem("token");
		dispatch(setUser(null));
		router.push("/");
	};

	return (
		<>
			<Navbar fluid className="bg-base-100 dark:bg-base-100">
				<Navbar.Brand href="/">
					{loading && (
						<div className="h-10 w-10 sm:inline-block sm:mr-3 mr-1 hidden"></div>
					)}
					{!loading && (
						<Image
							alt="FormFlow Logo"
							className="sm:mr-3 mr-1 sm:block hidden"
							src={`/logo_${theme}.svg`}
							width={40}
							height={40}
						/>
					)}
					<span
						className={`self-center whitespace-nowrap text-xl font-semibold ${bungee.className}`}
					>
						FormFlow
					</span>
				</Navbar.Brand>
				<div className="flex md:order-2">
					<Dropdown
						label="Locale Selector"
						renderTrigger={() => (
							<div className="flex justify-center items-center cursor-pointer">
								<FlagIcon
									countryCode={locale == "tr" ? "tr" : "us"}
									className="sm:w-5 sm:h-5 w-8 h-8 mr-2 rounded-full"
								/>
								<p className="sm:block hidden">
									{locale == "tr" ? "Türkçe" : "English"}
								</p>
							</div>
						)}
					>
						<Link
							href={pathname}
							locale="tr"
							className="outline-0 focus-visible:outline-0"
						>
							<Dropdown.Item
								icon={() => (
									<FlagIcon
										countryCode="tr"
										className="w-5 h-5 mr-2 rounded-full"
									/>
								)}
							>
								Türkçe
							</Dropdown.Item>
						</Link>

						<Link
							href={pathname}
							locale="en"
							className="outline-0 focus-visible:outline-0"
						>
							<Dropdown.Item
								icon={() => (
									<FlagIcon
										countryCode="us"
										className="w-5 h-5 mr-2 rounded-full"
									/>
								)}
							>
								English
							</Dropdown.Item>
						</Link>
					</Dropdown>
					<div
						className={`${
							loading ? "w-8 h-10 inline-block mx-4" : "hidden"
						}`}
					></div>
					<label
						className={`swap swap-rotate mx-4 hover:bg-transparent ${
							loading ? "hidden" : ""
						}`}
					>
						<input
							type="checkbox"
							onChange={changeTheme}
							checked={checked}
							className="!invisible"
						/>
						<svg
							className="swap-on fill-current w-8 h-8"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
						</svg>
						<svg
							className="swap-off fill-current w-8 h-8"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
						>
							<path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
						</svg>
					</label>
					<div className={loading ? "block" : "hidden"}>
						<svg
							className="w-10 h-10 text-gray-200 dark:text-gray-700"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
						</svg>
					</div>
					<Dropdown
						label="Avatar"
						className={loading ? "hidden" : ""}
						renderTrigger={() => (
							<div className="cursor-pointer">
								{!loading && (
									<>
										{user ? (
											<Avatar
												rounded
												img={user.base64Photo}
												alt={user.username}
											/>
										) : (
											<Avatar rounded />
										)}
									</>
								)}
							</div>
						)}
					>
						{user ? (
							<Dropdown.Header>
								<span className="block text-sm">
									{user.username}
								</span>
							</Dropdown.Header>
						) : (
							<Link
								href="/login"
								locale={locale}
								className="outline-0 focus-visible:outline-0"
							>
								<Dropdown.Item
									icon={HiArrowRightOnRectangle}
									className="focus-visible:outline-0 outline-0"
								>
									{t("login")}
								</Dropdown.Item>
							</Link>
						)}

						{user && (
							<>
								<Link
									href="/messages"
									locale={locale}
									className="outline-0 focus-visible:outline-0"
								>
									<Dropdown.Item icon={HiOutlineInbox}>
										{t("messages")}
									</Dropdown.Item>
								</Link>

								{user.role === "admin" && (
									<>
										<Link
											href="/users"
											locale={locale}
											className="outline-0 focus-visible:outline-0"
										>
											<Dropdown.Item
												icon={HiOutlineUserGroup}
											>
												{t("users")}
											</Dropdown.Item>
										</Link>

										<Link
											href="/reports"
											locale={locale}
											className="outline-0 focus-visible:outline-0"
										>
											<Dropdown.Item
												icon={HiOutlineDocumentChartBar}
											>
												{t("reports")}
											</Dropdown.Item>
										</Link>
									</>
								)}
								<Dropdown.Divider />
								<Dropdown.Item
									icon={HiOutlineArrowLeftOnRectangle}
									onClick={handleLogout}
								>
									{t("logout")}
								</Dropdown.Item>
							</>
						)}
					</Dropdown>
				</div>
			</Navbar>
		</>
	);
};

export default CustomNavbar;
