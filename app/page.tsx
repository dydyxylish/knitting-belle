import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export default function App() {
	return (
		<main>
			<div className="container mx-auto">
				<h1 className="text-3xl font-bold underline">
					編み図ダウンロードサイト
				</h1>
			</div>
		</main>
	);
}
