import React from "react";
import { LoginForm } from "@/components";
import pick from "lodash/pick";
import {
	useMessages,
	useLocale,
	NextIntlClientProvider,
	AbstractIntlMessages,
} from "next-intl";
import { getTranslator } from "next-intl/server";

export async function generateMetadata() {
	const locale = useLocale();
	const t = await getTranslator(locale, "Metadata");

	return {
		title: t("login"),
	};
}

const Login = () => {
	const messages = useMessages();
	const locale = useLocale();

	return (
		<>
			<div className="flex-1 flex flex-col items-center justify-center bg-base-100">
				<div className="container max-w-screen-sm mx-auto px-2 flex justify-center items-center">
					<NextIntlClientProvider
						locale={locale}
						messages={
							pick(messages, "LoginForm") as AbstractIntlMessages
						}
					>
						<LoginForm />
					</NextIntlClientProvider>
				</div>
			</div>
		</>
	);
};

export default Login;
