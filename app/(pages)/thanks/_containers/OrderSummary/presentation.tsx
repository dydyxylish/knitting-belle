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

export default function OrderSummaryPresentation({
	knittingPatternTitle,
	purchasedAt,
}: PurchaseTableProps) {
	return (
		<div className="mx-auto max-w-lg">
			<div className="overflow-hidden rounded-md border bg-background">
				<Table>
					<TableBody>
						<TableRow className="flex flex-row *:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
							<TableCell className="flex basis-1/4 flex-col items-center justify-center bg-muted/50 py-2 font-medium">
								編み図
							</TableCell>
							<TableCell className="basis-3/4 py-2">
								{knittingPatternTitle}
							</TableCell>
						</TableRow>
						<TableRow className="flex flex-row *:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
							<TableCell className="flex basis-1/4 flex-col items-center justify-center bg-muted/50 py-2 font-medium">
								決済日時
							</TableCell>
							<TableCell className="basis-3/4 py-2">
								{dayjs(purchasedAt).format("YYYY年M月D日 HH:mm")}
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
