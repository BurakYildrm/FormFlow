import AppProvider from "@/store/AppProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar, Footer } from "@/components";
import localeConfig from "@/locale.config";
import { notFound } from "next/navigation";
import {
	AbstractIntlMessages,
	NextIntlClientProvider,
	useLocale,
	useMessages,
} from "next-intl";
import pick from "lodash/pick";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "FormFlow",
};

export default function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const locale = useLocale();

	if (params.locale !== locale) {
		notFound();
	}

	const messages = useMessages();
	const cookieStore = cookies();
	const theme = cookieStore.has("theme")
		? (cookieStore.get("theme")?.value as string)
		: "dark";

	if (!cookieStore.has("theme")) {
		cookieStore.set("theme", theme);
	}

	//console.log("layout", theme);

	return (
		<AppProvider>
			<html lang={params.locale} data-theme={theme}>
				<body className={`${inter.className} flex flex-col h-screen`}>
					<Navbar locale={params.locale} />
					<div className="flex-1 flex">{children}</div>
					<Footer />
				</body>
			</html>
		</AppProvider>
	);
}
