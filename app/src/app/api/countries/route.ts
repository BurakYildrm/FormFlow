import { NextResponse } from "next/server";

export async function GET(req: Request) {
	const response = await fetch(`${process.env.SERVER_URL}api/countries`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	return NextResponse.json(data, {
		status: response.status,
	});
}
