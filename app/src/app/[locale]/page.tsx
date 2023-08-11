import { ContactForm } from "@/components";
import pick from "lodash/pick";
import {
	useMessages,
	useLocale,
	NextIntlClientProvider,
	AbstractIntlMessages,
} from "next-intl";

export default function Home() {
	const locale = useLocale();
	const messages = useMessages();

	return (
		<div className="flex-1 flex flex-col justify-center items-center">
			<NextIntlClientProvider
				locale={locale}
				messages={pick(messages, "ContactForm") as AbstractIntlMessages}
			>
				<ContactForm />
			</NextIntlClientProvider>
		</div>
	);
}
