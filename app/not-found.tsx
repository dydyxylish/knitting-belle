import { Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-gray-50">
			<div className="relative">
				<div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-slate-400 to-gray-500 opacity-20 blur-xl"></div>
				<div className="relative rounded-full bg-white p-6 shadow-lg">
					<Search className="h-8 w-8 text-slate-600" />
				</div>
			</div>
			<div className="mt-6 max-w-md text-center">
				<h2 className="mb-4 font-bold text-2xl text-gray-700">
					ページが見つかりません
				</h2>
				<div className="mb-6 rounded-lg bg-slate-50 p-4 shadow-sm">
					<p className="text-slate-600 text-sm">
						お探しのページは存在しないか、移動された可能性があります。
					</p>
				</div>
				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:from-cyan-600 hover:to-teal-600 hover:shadow-lg active:scale-95"
				>
					<Home className="h-4 w-4" />
					ホームに戻る
				</Link>
			</div>
		</div>
	);
}
