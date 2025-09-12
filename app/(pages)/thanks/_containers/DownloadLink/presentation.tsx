import { Download } from "lucide-react";

import { Button } from "@/app/_components/ui/button";

interface DownloadLinkPresentationProps {
	url: string;
	filename: string;
}

export const DownloadLinkPresentation = ({
	url,
	filename,
}: DownloadLinkPresentationProps) => {
	return (
		<Button variant="download" className="h-10">
			<a
				href={url}
				download={filename}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-2"
			>
				<Download />
				編み図ダウンロード
			</a>
		</Button>
	);
};
