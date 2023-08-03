import React from "react";
import { useTranslations } from "next-intl";

const Footer: React.FC = () => {
	const t = useTranslations("Footer");

	return (
		<footer className="footer footer-center p-4 bg-base-300 text-base-content">
			<div>
				<p>{t("copyright")}</p>
			</div>
		</footer>
	);
};

export default Footer;
