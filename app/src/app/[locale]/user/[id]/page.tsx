import React from "react";
import {
	useMessages,
	useLocale,
	NextIntlClientProvider,
	AbstractIntlMessages,
} from "next-intl";
import pick from "lodash/pick";
import { getTranslator } from "next-intl/server";
import { UserDetail } from "@/components";

interface UserProps {
	params: {
		id: string;
	};
}

export async function generateMetadata({ params: { id } }: UserProps) {
	const locale = useLocale();
	const t = await getTranslator(locale, "Metadata");

	return {
		title: t("user", { id }),
	};
}

const User: React.FC<UserProps> = ({ params: { id } }) => {
	const locale = useLocale();
	const messages = useMessages();

	return (
		<div className="flex-1 flex flex-col justify-center items-center">
			<NextIntlClientProvider
				locale={locale}
				messages={
					pick(
						messages,
						"UserDetail",
						"UserNotFound"
					) as AbstractIntlMessages
				}
			>
				<UserDetail id={id} />
			</NextIntlClientProvider>
		</div>
	);
};

export default User;
