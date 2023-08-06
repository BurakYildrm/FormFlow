import Link from "next-intl/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
	const t = useTranslations("NotFound");

	return (
		<div className="flex-1 flex flex-col items-center justify-center">
			<div className="container">
				<div className="flex flex-col items-center justify-center gap-4">
					<h1 className="text-2xl">{t("heading")}</h1>
					<h2 className="text-xl">{t("subHeading")}</h2>
					<p className="text-center">{t("message")}</p>
					<Link className="btn btn-warning" href="/">
						{t("button")}
					</Link>
				</div>
			</div>
		</div>
	);
}
