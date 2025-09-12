import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { amplifyConfigure } from "./_lib/configureAmplify";
import { cn } from "./_lib/tailwindUtils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Knitting Belle",
	description:
		"Knitting Belleの編み図ダウンロードサイト(Knitting pattern download site by knitting_belle)",
	openGraph: {
		type: "website",
		title: "Knitting Belle｜編み図販売サイト",
		description:
			"オリジナルの編み図をダウンロード販売。初心者から上級者まで楽しめるデザインが満載。",
		// url: "https://knittingbelle.com", // TODO 実際のドメインに変更
		siteName: "Knitting Belle",
		// images: [
		// 	{
		// 		url: "https://knittingbelle.com/ogp.png", // TODO OGP画像があるなら指定
		// 		width: 1200,
		// 		height: 630,
		// 		alt: "Knitting Belle 編み図販売サイト",
		// 	},
		// ],
	},
	// twitter: {
	// 	card: "summary_large_image",
	// 	title: "Knitting Belle｜編み図販売サイト",
	// 	description:
	// 		"オリジナルの編み図をダウンロード販売。初心者から上級者まで楽しめるデザインが満載。",
	// 	images: ["https://knittingbelle.com/ogp.png"], // TODO
	// },
};

amplifyConfigure();

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body className={cn(inter.className, "bg-background/50")}>
				<Header />
				<div className="container sm:mx-auto sm:flex sm:flex-col sm:items-center">
					{children}
				</div>
				<Footer />
			</body>
		</html>
	);
}
