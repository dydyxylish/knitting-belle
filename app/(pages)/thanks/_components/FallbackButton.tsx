import { Loader2 } from "lucide-react";

import { Button } from "@/app/_components/ui/button";

export const FallbackButton = () => (
	<Button variant="secondary" disabled className="flex h-10 gap-2">
		<Loader2 className="animate-spin" />
		<span>処理中</span>
	</Button>
);
