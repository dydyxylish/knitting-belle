import { dbClient } from "@/db/ssgClient";

export const dynamic = "force-static";

export default async function App() {
	const { data: knittingPatterns } = await dbClient.models.KnittingPattern.list(
		{
			filter: {
				isPublished: {
					eq: true,
				},
			},
		},
	);

	return (
		<main>
			<div className="container mx-auto">
				<h1 className="font-bold text-3xl underline">
					編み図ダウンロードサイト
				</h1>
				{knittingPatterns.map((knittingPatterns) => (
					<span key={knittingPatterns.id}>{knittingPatterns.title}</span>
				))}
			</div>
		</main>
	);
}
