import { App, Stack, StackProps, type RemovalPolicy } from "aws-cdk-lib";
import { GlobalBucket } from "@infrastructure/data/construct/GlobalBucket";
import { GlobalTable } from "@infrastructure/data/construct/GlobalTable";

export interface DataStackProps extends StackProps {
    env: {
        acccount: string;
        region: string;
    };
    appName: string;
    activeRegions: string[];
    primaryRegion: string;
    removalPolicy: RemovalPolicy;
}

export class DataStack extends Stack {
    constructor(scope: App, id: string, props: DataStackProps) {
        super(scope, id, props);

        new GlobalTable(this, "database", {
            appName: props.appName,
            region: props.env.region,
            primaryRegion: props.primaryRegion,
            activeRegions: props.activeRegions,
            removalPolicy: props.removalPolicy,
        });

        new GlobalBucket(this, "processed-storage", {
            appName: props.appName,
            account: props.env.acccount,
            region: props.env.region,
            primaryRegion: props.primaryRegion,
            activeRegions: props.activeRegions,
            removalPolicy: props.removalPolicy,
        });
    }
}
