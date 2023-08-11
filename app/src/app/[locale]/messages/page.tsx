import React from "react";
import pick from "lodash/pick";
import { getTranslator } from "next-intl/server";
import {
	useMessages,
	useLocale,
	NextIntlClientProvider,
	AbstractIntlMessages,
} from "next-intl";
import MessagesList from "@/components/MessagesList";

export async function generateMetadata() {
	const locale = useLocale();
	const t = await getTranslator(locale, "Metadata");

	return {
		title: t("messages"),
	};
}

const Messages: React.FC = () => {
	const messages = useMessages();
	const locale = useLocale();

	return (
		<div className="flex-1 bg-base-100">
			<div className="container flex flex-col justify-center h-full">
				<NextIntlClientProvider
					locale={locale}
					messages={
						pick(messages, "MessagesList") as AbstractIntlMessages
					}
				>
					<MessagesList />
				</NextIntlClientProvider>
			</div>
		</div>
	);
};

export default Messages;
