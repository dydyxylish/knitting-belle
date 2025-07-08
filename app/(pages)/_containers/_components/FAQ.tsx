import Link from "next/link";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/app/_components/ui/accordion";
import { env } from "@/lib/env";

export const FAQ = () => {
	return (
		<div className="mx-10 mt-24 flex flex-col items-center gap-8 rounded-2xl bg-secondary/20 pb-4 font-kiwi">
			<h3 className="mt-6 text-xl">よくあるご質問</h3>
			<Accordion
				type="single"
				collapsible
				className="mx-6"
				defaultValue="item-1"
			>
				<AccordionItem value="item-1">
					<AccordionTrigger>Q. 編み図はどのように届きますか？</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							A.
							ご購入後、すぐにPDFファイル形式でダウンロードできるURLを発行いたします。ご購入後は
							<Link href="/account">
								<span className="text-blue-600 underline">マイページ</span>
							</Link>
							から何度でも再ダウンロード可能です。
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger>Q. 支払い方法は何がありますか？</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							A. クレジットカード（JCB／Visa／Mastercard／AMEXなど）、Apple
							Pay、Google Payでのお支払いが可能です。
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger>
						Q. ダウンロードできないときはどうすればいいですか？
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							A. お手数ですが、
							<a
								href={env.INSTAGRAM_URL}
								target="_blank"
								rel="noopener noreferrer"
							>
								<span className="text-blue-600 underline">
									Instagramアカウント
								</span>
							</a>
							のダイレクトメッセージまたは
							<a href="mailto:dasu09spec@ymail.ne.jp">
								<span className="text-blue-600 underline">メール</span>
							</a>
							にてご連絡ください。状況を確認の上、再送いたします。
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-4">
					<AccordionTrigger>
						Q. 編み図には写真や説明もありますか？
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							A.
							はい。編み図には記号図・文章説明に加えて、作品の写真や仕上がりサイズなども記載しています。
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-5">
					<AccordionTrigger>
						Q. 間違って購入してしまいました。キャンセルできますか？
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							A.
							デジタル商品の性質上、ご購入後のキャンセル・返品は承っておりません。内容をよくご確認のうえご購入ください。
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-6">
					<AccordionTrigger>
						Q. 編み図が読めない／開けない場合は？
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							A.
							編み図はPDF形式で提供しています。スマートフォンやパソコンにPDF対応のアプリが必要です。Adobe
							Acrobat Readerなどをご利用ください。
						</p>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-8">
					<AccordionTrigger>
						Q. 作品をSNSに投稿してもいいですか？
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-4 text-balance">
						<p>
							A. もちろんです！#knitting_belle
							などのタグをつけていただけるととても嬉しいです。
						</p>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
};
