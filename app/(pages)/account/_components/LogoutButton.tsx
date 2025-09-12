import { LogOut } from "lucide-react";

import { Button } from "@/app/_components/ui/button";

export const LogoutButton = () => (
	<a href="/api/auth/sign-out">
		<Button variant="secondary" className="">
			<LogOut />
			ログアウト
		</Button>
	</a>
);
