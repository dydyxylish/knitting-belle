import dayjs from "dayjs";
import "dayjs/locale/ja";

import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@/app/_components/ui/table";

interface PurchaseTableProps {
	knittingPatternTitle: string;
	purchasedAt: string;
}

dayjs.locale("ja");

export default function PurchaseTable({
	knittingPatternTitle,
	purchasedAt,
}: PurchaseTableProps) {
	return (
		<div className="mx-auto max-w-lg">
			<div className="overflow-hidden rounded-md border bg-background">
				<Table>
					<TableBody>
						<TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
							<TableCell className="bg-muted/50 py-2 font-medium">
								編み図
							</TableCell>
							<TableCell className="py-2">{knittingPatternTitle}</TableCell>
						</TableRow>
						<TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
							<TableCell className="bg-muted/50 py-2 font-medium">
								ご購入日時
							</TableCell>
							<TableCell className="py-2">
								{dayjs(purchasedAt).format("YYYY年M月D日 HH:mm")}
							</TableCell>
						</TableRow>
						{/* <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
							<TableCell className="bg-muted/50 py-2 font-medium">
								Location
							</TableCell>
							<TableCell className="py-2">Seoul, KR</TableCell>
						</TableRow>
						<TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
							<TableCell className="bg-muted/50 py-2 font-medium">
								Status
							</TableCell>
							<TableCell className="py-2">Active</TableCell>
						</TableRow>
						<TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
							<TableCell className="bg-muted/50 py-2 font-medium">
								Balance
							</TableCell>
							<TableCell className="py-2">$1,000.00</TableCell>
						</TableRow> */}
					</TableBody>
				</Table>
			</div>
			{/* <p className="mt-4 text-center text-muted-foreground text-sm">
				Vertical table
			</p> */}
		</div>
	);
}
