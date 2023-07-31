import { Metadata } from "next";
import React from "react";
import { LoginForm } from "@/components";

export const metadata: Metadata = {
	title: "Login",
	description: "Login",
};

const Login = () => {
	return (
		<>
			<div className="flex flex-col items-center justify-center min-h-screen">
				<div className="container max-w-screen-sm mx-auto px-2">
					<LoginForm />
				</div>
			</div>
		</>
	);
};

export default Login;
