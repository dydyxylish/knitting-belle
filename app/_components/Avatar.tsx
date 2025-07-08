import { CircleUserRound } from "lucide-react";
import Image from "next/image";

import { isAuthenticated } from "@/lib/isAuthenticated";
import { getCurrentUserInfo } from "../../lib/getUserInfo";

export const Avatar = async () => {
	const isLogin = await isAuthenticated();
	if (isLogin) {
		const userProfile = await getCurrentUserInfo();
		if (userProfile?.picture) {
			return (
				<Image
					src={userProfile.picture}
					alt="userPicture"
					className="rounded-full"
					width={32}
					height={32}
				/>
			);
		}
	}
	return <CircleUserRound className="size-6" style={{ opacity: 0.4 }} />;
};
