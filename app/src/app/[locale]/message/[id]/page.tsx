import React from "react";
import {
	useMessages,
	useLocale,
	NextIntlClientProvider,
	AbstractIntlMessages,
} from "next-intl";
import pick from "lodash/pick";
import { getTranslator } from "next-intl/server";
import MessageDetail from "@/components/MessageDetail";

interface MessageProps {
	params: {
		id: string;
	};
}

export async function generateMetadata({ params: { id } }: MessageProps) {
	const locale = useLocale();
	const t = await getTranslator(locale, "Metadata");

	return {
		title: t("message", { id }),
	};
}

const Message: React.FC<MessageProps> = ({ params: { id } }) => {
	const locale = useLocale();
	const messages = useMessages();

	return (
		<div className="flex-1 flex flex-col justify-center items-center">
			<NextIntlClientProvider
				locale={locale}
				messages={
					pick(
						messages,
						"MessageDetail",
						"MessageNotFound"
					) as AbstractIntlMessages
				}
			>
				<MessageDetail id={id} />
			</NextIntlClientProvider>
		</div>
	);
};

export default Message;
