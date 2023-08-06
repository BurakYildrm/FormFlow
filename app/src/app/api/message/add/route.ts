import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();

	const response = await fetch(`${process.env.SERVER_URL}api/message/add`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	const data = await response.json();
	return NextResponse.json(data, {
		status: response.status,
	});
}
