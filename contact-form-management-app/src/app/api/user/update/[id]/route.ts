import { NextResponse } from "next/server";

export async function POST(
	req: Request,
	{ params }: { params: { id: string } }
) {
	const body = await req.json();

	const response = await fetch(
		`${process.env.SERVER_URL}api/user/update/${params.id}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: req.headers.get("token") ?? "",
			},
			body: JSON.stringify(body),
		}
	);

	const data = await response.json();
	return NextResponse.json(data);
}
