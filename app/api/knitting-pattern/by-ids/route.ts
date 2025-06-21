import { type NextRequest, NextResponse } from "next/server";

import { dbClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const ids = searchParams.getAll("id");
	try {
		const { data: knittingPatterns } =
			await dbClient.models.KnittingPattern.list({
				filter: {
					and: [
						{
							isPublished: {
								eq: true,
							},
						},
						{
							or: ids.map((id) => ({
								id: { eq: id },
							})),
						},
					],
				},
			});
		log.info({ knittingPatterns }, "編み図（ID別）データを取得しました");

		return NextResponse.json(knittingPatterns);
	} catch (e) {
		log.error({ e }, "編み図(ID別)データ取得に失敗しました");

		return NextResponse.json(
			ids.map((id) => new Error(`データ取得に失敗しました ID:${id}`)),
		);
	}
}
