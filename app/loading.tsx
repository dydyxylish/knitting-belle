import { Loader } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50">
			<div className="relative">
				<div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 opacity-30 blur-xl"></div>
				<div className="relative rounded-full bg-white p-6 shadow-lg">
					<Loader className="h-8 w-8 animate-spin text-cyan-600" />
				</div>
			</div>
			<div className="mt-6 text-center">
				<p className="mb-2 font-medium text-gray-700 text-lg">Loading...</p>
			</div>
		</div>
	);
}
