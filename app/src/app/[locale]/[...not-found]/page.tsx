import { useLocale } from "next-intl";
import { getTranslator } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateMetadata() {
	const locale = useLocale();
	const t = await getTranslator(locale, "Metadata");

	return {
		title: t("notFound"),
	};
}

export default function NotFoundDummy() {
	notFound();
}
