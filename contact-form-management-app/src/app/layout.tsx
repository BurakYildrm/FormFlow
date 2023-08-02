import AppProvider from "@/store/AppProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar, Footer } from "@/components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "FormFlow",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AppProvider>
			<html lang="en" data-theme="dark">
				<body className={inter.className}>
					<Navbar />
					{children}
					<Footer />
				</body>
			</html>
		</AppProvider>
	);
}
