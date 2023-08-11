"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Alert, LocalizedCombobox, Select } from ".";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store";
import { CheckLoginResponse } from "@/types";
import { addMessage } from "@/services";

interface Country {
	en: string;
	tr: string;
}

interface CountriesResponse {
	data: {
		countries: Array<Country>;
	};
}

const ContactForm: React.FC = () => {
	const locale = useLocale();
	const t = useTranslations("ContactForm");
	const [name, setName] = useState<string>("");
	const [gender, setGender] = useState<string>("gender");
	const [country, setCountry] = useState<string>("country");
	const [countries, setCountries] = useState<Array<Country>>([]);
	const [message, setMessage] = useState<string>("");
	const [alert, setAlert] = useState<boolean>(false);
	const [alertType, setAlertType] = useState<string>("");
	const [genderKey, setGenderKey] = useState<number>(0);
	const [countryKey, setCountryKey] = useState<number>(0);
	const dispatch = useAppDispatch();

	useEffect(() => {
		fetch("/api/countries", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		}).then(async (res) => {
			const response: CountriesResponse = await res.json();
			setCountries(
				response.data.countries.sort((a, b) =>
					a[locale as keyof Country].localeCompare(
						b[locale as keyof Country]
					)
				)
			);
		});

		const token = localStorage.getItem("token");

		if (!token) {
			dispatch(setUser(null));
			return;
		}

		fetch("/api/user/check-login", {
			cache: "no-cache",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
		}).then(async (response) => {
			const status: number = response.status;

			if (status == 401) {
				dispatch(setUser(null));
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
		});
	}, []);

	const retrieveCountry = (country: string) => {
		setCountry(country);
		document.getElementById("country")?.classList.remove("empty");
	};

	const retrieveGender = (gender: string) => {
		setGender(gender);
		document.getElementById("gender")?.classList.remove("empty");
	};

	const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		let check = 0;

		if (!name) {
			document.getElementById("name")?.classList.add("empty", "error");
			check++;
		}

		if (!gender) {
			document.getElementById("gender")?.classList.add("empty");
			document.getElementById("select-button")?.classList.add("error");
			check++;
		}

		if (!country) {
			document.getElementById("country")?.classList.add("empty");
			document.getElementById("combobox-input")?.classList.add("error");
			check++;
		}

		if (!message) {
			document.getElementById("message")?.classList.add("empty", "error");
			check++;
		}

		if (name.length > 50) {
			document.getElementById("name")?.classList.add("invalid", "error");
			check++;
		}

		if (message.length > 500) {
			document
				.getElementById("message")
				?.classList.add("invalid", "error");
			check++;
		}

		if (check > 0) {
			return;
		}

		await addMessage(name, message, gender, country);
		setAlertType("success");
		setAlert(true);
		setName("");
		setMessage("");
		setCountryKey((prevState) => prevState + 1);
		setGenderKey((prevState) => prevState + 1);
	};

	return (
		<>
			<div className="bg-base-100 w-full">
				<div className="py-6 px-4 mx-auto max-w-2xl lg:py-16">
					<h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
						{t("heading")}
					</h2>
					<p className="mb-4 text-sm text-gray-900 dark:text-white">
						{t("subHeading")}
					</p>
					<form onSubmit={sendMessage} noValidate>
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
									value={name}
									onChange={(e) => {
										setName(e.target.value);
										e.target.classList.remove(
											"empty",
											"error"
										);
									}}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent dark:focus:border-accent peer/name [&.error]:text-error [&.error]:border-error [&.error]:focus:border-error [&.error]:focus:ring-error"
									placeholder={t("namePlaceholder")}
									autoComplete="off"
								/>
								<div className="peer-[.empty]/name:block hidden text-sm text-error mt-1">
									{t("emptyNameError")}
								</div>
								<div className="peer-[.invalid]/name:block hidden text-sm text-error mt-1">
									{t("invalidNameError")}
								</div>
							</div>
							<div>
								<label
									htmlFor="gender"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									{t("gender")}
								</label>
								<div
									id="gender"
									className="peer/gender"
									key={genderKey}
								>
									<Select
										data={["", t("male"), t("female")]}
										retrieveData={retrieveGender}
										placeholder={t("genderPlaceholder")}
										showPlaceholder={true}
									/>
								</div>
								<div className="peer-[.empty]/gender:block hidden text-sm text-error mt-1">
									{t("emptyGenderError")}
								</div>
							</div>
							<div>
								<label
									htmlFor="country"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									{t("country")}
								</label>
								<div
									id="country"
									className="peer/country"
									key={countryKey}
								>
									<LocalizedCombobox
										data={countries}
										noDataText={t("countryNotFound")}
										placeholder={t("countryPlaceholder")}
										retrieveData={retrieveCountry}
									/>
								</div>
								<div className="peer-[.empty]/country:block hidden text-sm text-error mt-1">
									{t("emptyCountryError")}
								</div>
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
									value={message}
									onChange={(e) => {
										setMessage(e.target.value);
										e.target.classList.remove(
											"empty",
											"error"
										);
									}}
									rows={6}
									className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary border border-gray-300 focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-accent dark:focus:border-accent peer/message [&.error]:text-error [&.error]:border-error [&.error]:focus:border-error [&.error]:focus:ring-error"
									placeholder={t("messagePlaceholder")}
									style={{ resize: "none" }}
								></textarea>
								<div className="peer-[.empty]/message:block hidden text-sm text-error mt-1">
									{t("emptyMessageError")}
								</div>
								<div className="peer-[.invalid]/message:block hidden text-sm text-error mt-1">
									{t("invalidMessageError")}
								</div>
							</div>
						</div>
						<button
							type="submit"
							className="btn btn-primary dark:btn-accent text-sm px-5 py-2.5 mt-4 sm:mt-6 sm:w-auto w-full"
						>
							{t("submit")}
						</button>
					</form>
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
							<Alert type={alertType} message={t(alertType)} />
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default ContactForm;
