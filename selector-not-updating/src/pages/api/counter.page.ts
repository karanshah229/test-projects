import { NextApiRequest, NextApiResponse } from "next";

let counter = 0;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "GET") {
		await new Promise((r) => setTimeout(r, 1500));
		res.status(200).json({ data: counter });
	}
}
