import { Loader2 } from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import { Skeleton } from "@/app/_components/ui/skeleton";

export const FallbackThanks = () => (
	<div className="container mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-8 px-4 sm:max-w-lg sm:gap-10 md:max-w-xl md:gap-12">
		{/* Header Section */}
		<div className="flex flex-col items-center space-y-4 sm:space-y-5 md:space-y-6">
			{/* Main Icon/Image Placeholder */}
			<div className="relative">
				<Skeleton className="h-[120px] w-[120px] rounded-2xl shadow-sm sm:h-[140px] sm:w-[140px] md:h-[160px] md:w-[160px]" />
				<div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-50/20 to-slate-100/10" />
			</div>

			{/* Text Content Placeholders */}
			<div className="flex flex-col items-center space-y-3">
				<div className="space-y-2">
					<Skeleton className="h-4 w-[180px] rounded-full sm:h-5 sm:w-[220px] md:w-[260px]" />
					<Skeleton className="h-4 w-[180px] rounded-full sm:h-5 sm:w-[220px] md:w-[260px]" />
				</div>
				<Skeleton className="h-3 w-[120px] rounded-full opacity-70 sm:w-[140px] md:w-[160px]" />
			</div>
		</div>

		{/* Loading Section */}
		<div className="flex flex-col items-center space-y-4">
			<Button
				variant="secondary"
				disabled
				className="flex h-9 gap-2 text-sm sm:h-10 sm:text-base"
			>
				<Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
				<span>処理中</span>
			</Button>
		</div>
	</div>
);
