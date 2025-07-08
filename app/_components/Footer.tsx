import Link from "next/link";

import { Separator } from "./ui/separator";

export const Footer = () => (
	<footer className="mt-16 mb-2 flex flex-col items-center gap-2 font-mono text-slate-600 text-xs">
		<div className="flex h-4 items-center gap-2">
			<Link href="/terms-of-use">
				<span>利用規約</span>
			</Link>

			<Separator orientation="vertical" />
			<Link href="/privacy-policy">
				<span>プライバシーポリシー</span>
			</Link>
		</div>
		<span className="">© 2025 Knitting Belle. All rights reserved.</span>
	</footer>
);
