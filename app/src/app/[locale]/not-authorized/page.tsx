import { useLocale, useTranslations } from "next-intl";
import Link from "next-intl/link";
import { getTranslator } from "next-intl/server";
import React from "react";

export async function generateMetadata() {
	const locale = useLocale();
	const t = await getTranslator(locale, "Metadata");

	return {
		title: t("notAuthorized"),
	};
}

const NotAuthorized = () => {
	const t = useTranslations("NotAuthorized");
	const locale = useLocale();

	return (
		<div className="flex-1 flex flex-col items-center justify-center">
			<div className="container">
				<div className="flex flex-col items-center justify-center gap-4">
					<h1 className="text-2xl">{t("heading")}</h1>
					<h2 className="text-xl">{t("subHeading")}</h2>
					<p className="text-center">{t("message")}</p>
					<Link className="btn btn-warning" href="/" locale={locale}>
						{t("button")}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NotAuthorized;
