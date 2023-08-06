import { NextResponse } from "next/server";

export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const response = await fetch(
		`${process.env.SERVER_URL}api/message/read/${params.id}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: req.headers.get("token") || "",
			},
		}
	);

	const data = await response.json();
	return NextResponse.json(data, {
		status: response.status,
	});
}
