import { AppProvider } from "@/store";
import "@/app/globals.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CustomNavbar, Footer } from "@/components";
import { notFound } from "next/navigation";
import {
	AbstractIntlMessages,
	NextIntlClientProvider,
	useLocale,
	useMessages,
} from "next-intl";
import pick from "lodash/pick";
import { cookies } from "next/headers";

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

	const cookieStore = cookies();
	const messages = useMessages();

	async function setTheme(theme: string) {
		"use server";

		cookieStore.set("theme", theme);
	}

	const theme = cookieStore.has("theme")
		? (cookieStore.get("theme")?.value as string)
		: "dark";

	if (!cookieStore.has("theme")) {
		setTheme(theme);
	}

	return (
		<AppProvider>
			<html lang={params.locale} data-theme={theme}>
				<body className={`${inter.className} flex flex-col h-screen`}>
					<NextIntlClientProvider
						locale={locale}
						messages={
							pick(messages, "Navbar") as AbstractIntlMessages
						}
					>
						<CustomNavbar />
					</NextIntlClientProvider>
					<div className="flex-1 flex">{children}</div>
					<Footer />
				</body>
			</html>
		</AppProvider>
	);
}
