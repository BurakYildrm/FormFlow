"use client";

import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useLocale } from "next-intl";

export interface Data {
	en: string;
	tr: string;
}

interface LocalizedComboboxProps {
	data: Array<Data>;
	noDataText: string;
	placeholder: string;
	retrieveData: (data: string) => void;
}

const LocalizedCombobox: React.FC<LocalizedComboboxProps> = ({
	data,
	noDataText,
	placeholder,
	retrieveData,
}: LocalizedComboboxProps) => {
	const locale = useLocale();
	const [selected, setSelected] = useState<Data | null>(null);
	const [query, setQuery] = useState<string>("");

	const filteredData =
		query === ""
			? data
			: data.filter((el) =>
					el[locale as keyof Data]
						.toLowerCase()
						.replace(/\s+/g, "")
						.includes(query.toLowerCase().replace(/\s+/g, ""))
			  );

	useEffect(() => {
		retrieveData(selected?.[locale as keyof Data] ?? "");
		document.getElementById("combobox-input")?.classList.remove("error");
	}, [selected]);

	return (
		<Combobox value={selected} onChange={setSelected} nullable>
			<div className="relative mt-1">
				<div
					id="combobox-input"
					className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus-within:ring-1 focus-within:ring-primary focus-within:border-primary block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus-within:ring-accent dark:focus-within:border-accent focus-within:outline-0 [&.error]:text-error [&.error]:border-error [&.error]:focus-within:border-error [&.error]:focus-within:ring-error group"
				>
					<Combobox.Input
						className="w-full border-none py-1 pl-3 pr-10 sm:text-sm leading-5 text-gray-900 focus:ring-0 bg-gray-50 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white focus:outline-none group-[.error]:placeholder-error group-[.error]:text-error"
						displayValue={(el: Data | null) =>
							el?.[locale as keyof Data] ?? ""
						}
						onChange={(event) => setQuery(event.target.value)}
						placeholder={placeholder}
						autoComplete="off"
					/>
					<Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
						<ChevronUpDownIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</Combobox.Button>
				</div>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
					afterLeave={() => setQuery("")}
				>
					<Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{filteredData.length === 0 && query !== "" ? (
							<div className="relative cursor-default select-none py-2 px-4 text-gray-900 dark:text-white">
								{noDataText}
							</div>
						) : (
							filteredData.map((el, index) => (
								<Combobox.Option
									key={index}
									className={({ active }) =>
										`relative cursor-default select-none py-2 pl-10 pr-4 ${
											active
												? "bg-primary text-primary-content dark:bg-accent dark:text-accent-content"
												: "bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white"
										}`
									}
									value={el}
								>
									{({ selected, active }) => (
										<>
											<span
												className={`block truncate ${
													selected
														? "font-medium"
														: "font-normal"
												}`}
											>
												{el[locale as keyof Data]}
											</span>
											{selected ? (
												<span
													className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
														active
															? "text-primary-content dark:text-accent-content"
															: "text-primary dark:text-accent"
													}`}
												>
													<CheckIcon
														className="h-5 w-5"
														aria-hidden="true"
													/>
												</span>
											) : null}
										</>
									)}
								</Combobox.Option>
							))
						)}
					</Combobox.Options>
				</Transition>
			</div>
		</Combobox>
	);
};

export default LocalizedCombobox;
