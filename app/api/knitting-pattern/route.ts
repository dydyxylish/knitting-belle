import { type NextRequest, NextResponse } from "next/server";

import { dbClient } from "@/db/serverSideClient";
import { getLogger } from "@/lib/logger";

const log = getLogger(import.meta.url);

export async function GET(request: NextRequest) {
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
					],
				},
			});
		log.info({ knittingPatterns }, "編み図（全体）データを取得しました");

		return NextResponse.json(knittingPatterns);
	} catch (e) {
		log.error({ e }, "編み図(全体)データ取得に失敗しました");

		return NextResponse.json(
			new Error(`編み図（全体）データ取得に失敗しました`),
		);
	}
}
