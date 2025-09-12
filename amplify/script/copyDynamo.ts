import {
	type AttributeValue,
	BatchWriteItemCommand,
	type BatchWriteItemCommandInput,
	DynamoDBClient,
	ScanCommand,
	type ScanCommandInput,
} from "@aws-sdk/client-dynamodb";
import { chunk } from "es-toolkit/array";

interface CopyTableOptions {
	sourceTable: string;
	targetTable: string;
	region?: string;
}

async function copyTable(options: CopyTableOptions) {
	const region = options.region || process.env.AWS_REGION || "ap-northeast-1";

	const client = new DynamoDBClient({
		region,
	});

	console.log(
		`🚀 Starting copy from ${options.sourceTable} to ${options.targetTable} in region ${region}`,
	);
	let lastEvaluatedKey: Record<string, AttributeValue> | undefined;

	do {
		const scanParams: ScanCommandInput = {
			TableName: options.sourceTable,
			ExclusiveStartKey: lastEvaluatedKey,
		};
		const response = await client.send(new ScanCommand(scanParams));

		if (!response.Items || response.Items.length === 0) break;

		for (const chunked of chunk(response.Items, 25)) {
			const writeParams: BatchWriteItemCommandInput = {
				RequestItems: {
					[options.targetTable]: chunked.map((item) => ({
						PutRequest: { Item: item },
					})),
				},
			};
			await client.send(new BatchWriteItemCommand(writeParams));
		}

		lastEvaluatedKey = response.LastEvaluatedKey;
	} while (lastEvaluatedKey);

	console.log("✅ Copy completed!");
}

// コマンドライン引数でテーブル名を指定
const args = process.argv.slice(2);

if (args.length < 2) {
	console.error(
		"❌ Usage: node script/copyDynamo.ts <sourceTable> <targetTable> [region]",
	);
	console.error(
		"   Example: node script/copyDynamo.ts MySourceTable MyTargetTable us-east-1",
	);
	process.exit(1);
}

const options: CopyTableOptions = {
	sourceTable: args[0],
	targetTable: args[1],
	region: args[2],
};

copyTable(options).catch((err) => {
	console.error("❌ Error copying table:", err);
	process.exit(1);
});
