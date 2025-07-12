import { Download } from "lucide-react";

import { Button } from "@/app/_components/ui/button";

interface DownloadButtonPresentationProps {
	url: string;
	filename: string;
}

export const DownloadButtonPresentation = ({
	url,
	filename,
}: DownloadButtonPresentationProps) => (
	<Button variant="download" className="h-10">
		<a
			href={url}
			download={filename}
			target="_blank"
			rel="noopener noreferrer"
			className=""
		>
			<Download />
		</a>
	</Button>
);
