"use client";

import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface SelectProps {
	data: Array<string>;
	retrieveData: (data: string) => void;
	placeholder?: string;
	showPlaceholder?: boolean;
}

const Select: React.FC<SelectProps> = ({
	data,
	retrieveData,
	placeholder,
	showPlaceholder,
}: SelectProps) => {
	const [selected, setSelected] = useState<string>(data[0]);

	useEffect(() => {
		retrieveData(selected);
		document.getElementById("select-button")?.classList.remove("error");
	}, [selected]);
	// py-2 pl-3 pr-10
	return (
		<Listbox value={selected} onChange={setSelected}>
			<div
				id="select-button"
				className="relative mt-1 focus-within:border focus-within:ring-1 focus-within:ring-primary focus-within:border-primary dark:focus-within:ring-accent dark:focus-within:border-accent focus-within:outline-0 rounded-lg group [&.error]:focus-within:border-error [&.error]:focus-within:ring-error"
			>
				<Listbox.Button className="bg-gray-50 border border-gray-300 dark:bg-gray-700 dark:border-gray-600 rounded-lg text-gray-900 sm:text-sm focus:ring-0 relative w-full cursor-default py-2.5 pl-3 pr-10 leading-5 text-left dark:text-white focus:outline-none group-focus-within:border-0 group-[.error]:text-error group-[.error]:border-error">
					<span className="block truncate">
						{selected === "" && showPlaceholder
							? placeholder
							: selected}
					</span>
					<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
						<ChevronUpDownIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</span>
				</Listbox.Button>
				<Transition
					as={Fragment}
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-50 dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
						{data.map((el, index) => (
							<Listbox.Option
								key={index}
								disabled={el == ""}
								className={({ active }) =>
									`relative cursor-default select-none py-2 pl-10 pr-4 ${
										el == ""
											? "bg-gray-300 text-gray-500 dark:bg-gray-500 dark:text-gray-300"
											: active
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
											{el === "" && showPlaceholder
												? placeholder
												: el}
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
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</div>
		</Listbox>
	);
};

export default Select;
