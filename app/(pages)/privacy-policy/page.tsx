import { Card, CardContent, CardTitle } from "@/app/_components/ui/card";
import { env } from "@/lib/env";

export default function Page() {
	return (
		<div className="pt-20 ">
			<Card className="border-none bg-transparent shadow-none">
				<CardTitle className="px-6 text-2xl">プライバシーポリシー</CardTitle>
				<CardContent className="text-sm">
					<p>
						Knitting
						Belle（以下「当サイト」といいます）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシーを定め、これを遵守します。
					</p>
					<br />
					<h2>1. 個人情報の収集</h2>
					<p>
						当サイトでは、お問い合わせや購入時に以下の情報を収集する場合があります。
					</p>
					{/* <ul>
							<li>氏名</li>
						</ul> */}
					<ul className="mt-2 ml-4 list-disc">
						<li>メールアドレス</li>
						<li>その他必要な情報</li>
					</ul>
					<br />
					<h2>2. 個人情報の利用目的</h2>
					<p>収集した情報は以下の目的のために利用します。</p>
					<ul className="mt-2 ml-4 list-disc">
						<li> 商品の提供および連絡</li>

						<li>お問い合わせ対応</li>

						<li>メンテナンス・重要なお知らせの通知</li>

						<li>利用状況の分析</li>
					</ul>
					<br />
					<h2>3. 第三者提供について</h2>
					<p>
						法令に基づく場合を除き、本人の同意なく第三者に情報を提供することはありません。{" "}
					</p>
					<br />
					<h2>4. セキュリティ</h2>
					<p>個人情報の安全管理のため、必要かつ適切な措置を講じます。</p>
					<br />
					<h2>5. お問い合わせ</h2>
					<p>
						個人情報に関するお問い合わせは、下記の連絡先までご連絡ください。
					</p>
					<a href={`mailto:${env.NEXT_PUBLIC_CONTACT_EMAIL}`}>
						<span className="text-blue-600 underline">
							{env.NEXT_PUBLIC_CONTACT_EMAIL}
						</span>
					</a>
				</CardContent>
			</Card>
		</div>
	);
}
