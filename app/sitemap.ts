import type { MetadataRoute } from "next";

import { env } from "@/lib/env";
import { getCachedKnittingPatternList } from "./_lib/fetch/knittingPattern/getCachedKnittingPatternList";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let baseUrl: string;
	if (env.AMPLIFY_PRODUCTION) {
		baseUrl = env.AMPLIFY_APP_ORIGIN;
	} else {
		baseUrl = `${env.AMPLIFY_APP_ORIGIN}:3000`;
	}

	// 静的ページ
	const staticPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 1,
		},
		{
			url: `${baseUrl}/account`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/privacy-policy`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
		{
			url: `${baseUrl}/terms-of-use`,
			lastModified: new Date(),
			changeFrequency: "yearly",
			priority: 0.3,
		},
	];

	// 動的ページ（編み図商品）
	try {
		const knittingPatterns = await getCachedKnittingPatternList();

		const productPages: MetadataRoute.Sitemap = knittingPatterns.map(
			(pattern) => ({
				url: `${baseUrl}/${pattern.slug}`,
				lastModified: new Date(),
				changeFrequency: "monthly" as const,
				priority: 0.8,
			}),
		);

		return [...staticPages, ...productPages];
	} catch (error) {
		console.error("Failed to generate sitemap:", error);
		// エラー時は静的ページのみ返す
		return staticPages;
	}
}
