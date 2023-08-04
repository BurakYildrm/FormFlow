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
		<main className="flex-1">
			<NextIntlClientProvider
				locale={locale}
				messages={pick(messages, "ContactForm") as AbstractIntlMessages}
			>
				<ContactForm />
			</NextIntlClientProvider>
		</main>
	);
}

//flex-col items-center justify-between h-full
