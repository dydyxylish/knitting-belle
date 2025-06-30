interface DownloadLinkPresentationProps {
	url: string;
	filename: string;
}

export const DownloadLinkPresentation = ({
	url,
	filename,
}: DownloadLinkPresentationProps) => {
	return (
		<div>
			<a
				href={url}
				download={filename}
				target="_blank"
				rel="noopener noreferrer"
			>
				🧶編み図ダウンロードリンク
			</a>
		</div>
	);
};
