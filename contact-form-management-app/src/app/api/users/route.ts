import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const response = await fetch(`${process.env.SERVER_URL}api/users`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			token: req.headers.get("token") || "",
		},
	});

	const data = await response.json();
	return NextResponse.json(data);
}
