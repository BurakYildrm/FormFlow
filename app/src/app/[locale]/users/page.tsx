import React from "react";
import {
	useMessages,
	useLocale,
	NextIntlClientProvider,
	AbstractIntlMessages,
} from "next-intl";
import pick from "lodash/pick";
import { getTranslator } from "next-intl/server";
import { UsersList } from "@/components";

export async function generateMetadata() {
	const locale = useLocale();
	const t = await getTranslator(locale, "Metadata");

	return {
		title: t("users"),
	};
}

const Users = () => {
	const locale = useLocale();
	const messages = useMessages();

	return (
		<div className="flex-1 flex flex-col justify-center items-center">
			<div className="container flex flex-col justify-center h-full">
				<NextIntlClientProvider
					locale={locale}
					messages={
						pick(messages, "UsersList") as AbstractIntlMessages
					}
				>
					<UsersList />
				</NextIntlClientProvider>
			</div>
		</div>
	);
};

export default Users;
