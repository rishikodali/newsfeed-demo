import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Billing, TableV2, type ITableV2 } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export interface GlobalTableProps {
    appName: string;
    region: string;
    activeRegions: string[];
    primaryRegion: string;
    removalPolicy: RemovalPolicy;
}

export class GlobalTable extends Construct {
    table: ITableV2;

    constructor(scope: Construct, id: string, props: GlobalTableProps) {
        super(scope, id);

        const tableName = props.appName;

        if (props.region === props.primaryRegion) {
            const replicationRegions = props.activeRegions.filter(
                (region) => region !== props.region,
            );

            const table = new TableV2(this, "global-table", {
                tableName,
                billing: Billing.onDemand(),
                removalPolicy: props.removalPolicy,
                partitionKey: { name: "pk", type: AttributeType.STRING },
                sortKey: { name: "sk", type: AttributeType.STRING },
            });

            for (const replicationRegion of replicationRegions) {
                table.addReplica({ region: replicationRegion });
            }

            this.table = table;
        } else {
            this.table = TableV2.fromTableName(this, "regional-table", tableName);
        }
    }
}
