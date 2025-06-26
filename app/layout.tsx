import { Amplify } from "aws-amplify";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import outputs from "@/amplify_outputs.json";
import "./globals.css";
import Link from "next/link";

import { LoginWrapper } from "./_components/LoginWrapper";

Amplify.configure(outputs);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Knitting Belle",
	description:
		"Knitting Belleの編み図ダウンロードサイト(Knitting pattern download site by knitting_belle)",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja">
			<body className={inter.className}>
				<div className="flex gap-8"></div>
				<Link href="/">
					<button className="border" type="button">
						トップに戻る
					</button>
				</Link>
				<LoginWrapper>
					<button type="button" className="border">
						Sign in Google Account
					</button>
				</LoginWrapper>
				{children}
			</body>
		</html>
	);
}
