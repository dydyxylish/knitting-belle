import Link from "next/link";

import { KnittingPatternList } from "./_containers/knittingPatternList";

export default function App() {
	return (
		<main>
			<div className="container mx-auto">
				<Link href="/sign-in">サインイン</Link>
				<h1 className="font-bold text-3xl underline">
					編み図ダウンロードサイト
				</h1>
				<KnittingPatternList></KnittingPatternList>
			</div>
		</main>
	);
}
