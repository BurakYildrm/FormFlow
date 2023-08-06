import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const response = await fetch(
		`${process.env.SERVER_URL}api/user/check-login`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: req.headers.get("token") ?? "",
			},
		}
	);

	const data = await response.json();
	return NextResponse.json(data, {
		status: response.status,
	});
}
