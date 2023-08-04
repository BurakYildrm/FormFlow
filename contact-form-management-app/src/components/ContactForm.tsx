"use client";

import React, { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

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
	const t = useTranslations("ContactForm");
	const [countries, setCountries] = useState<Array<Country>>([]);
	const locale = useLocale();

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
	}, []);

	return (
		<>
			<section className="bg-base-100">
				<div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
					<h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
						{t("heading")}
					</h2>
					<p className="mb-4 text-sm text-gray-900 dark:text-white">
						{t("subHeading")}
					</p>
					<form action="#">
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
									name="name"
									id="name"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder={t("namePlaceholder")}
									required
								/>
							</div>
							<div>
								<label
									htmlFor="gender"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									{t("gender")}
								</label>
								<select
									id="gender"
									defaultValue={"gender"}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 select focus:outline-0"
								>
									<option value="gender" disabled>
										{t("genderPlaceholder")}
									</option>
									<option value="male">{t("male")}</option>
									<option value="female">
										{t("female")}
									</option>
									<option value="other">{t("other")}</option>
									<option value="na">{t("na")}</option>
								</select>
							</div>
							<div>
								<label
									htmlFor="country"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									{t("country")}
								</label>
								<select
									id="country"
									defaultValue={"country"}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 select focus:outline-0"
								>
									<option value="country" disabled>
										{t("countryPlaceholder")}
									</option>
									{countries.map((country, index) => (
										<option key={index} value={country.en}>
											{country[locale as keyof Country]}
										</option>
									))}
								</select>
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
									rows={8}
									className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
									placeholder={t("messagePlaceholder")}
									style={{ resize: "none" }}
								></textarea>
							</div>
						</div>
						<button
							type="submit"
							className="btn btn-accent text-sm px-5 py-2.5 mt-4 sm:mt-6"
						>
							{t("submit")}
						</button>
					</form>
				</div>
			</section>
		</>
	);
};

export default ContactForm;

/*
className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
*/
