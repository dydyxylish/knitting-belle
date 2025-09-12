import { OwnPurchaseHistory } from "./_containers/OwnPurchaseHistory";

export default function Page() {
	return (
		<div className="mt-16 flex flex-col items-center">
			<h1 className="mt-8 font-league text-5xl">My Page</h1>
			<p className="mt-8 font-kiwi text-xl">ご購入履歴</p>
			<OwnPurchaseHistory />
		</div>
	);
}
