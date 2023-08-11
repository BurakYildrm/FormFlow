import React from "react";
import TrFlag from "../../public/tr.svg";
import UsFlag from "../../public/us.svg";

interface FlagIconProps extends React.SVGProps<SVGSVGElement> {
	countryCode: string;
}

const FlagIcon: React.FC<FlagIconProps> = ({ countryCode, ...rest }) => {
	const flags = {
		tr: <TrFlag {...rest} />,
		us: <UsFlag {...rest} />,
	};

	const flag = flags[countryCode as keyof typeof flags];

	return flag;
};

export default FlagIcon;
