import { KnittingPatternList } from "./_containers/knittingPatternList";

export const experimental_ppr = true;

export default async function App() {
	return (
		<main>
			<div className="container mx-auto">
				<h1 className="font-bold text-3xl underline">
					編み図ダウンロードサイト
				</h1>
				<KnittingPatternList></KnittingPatternList>
			</div>
		</main>
	);
}
