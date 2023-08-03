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

	return (
		<AppProvider>
			<html lang={params.locale} data-theme="dark">
				<body className={inter.className}>
					<Navbar />
					{children}
					<Footer />
				</body>
			</html>
		</AppProvider>
	);
}
