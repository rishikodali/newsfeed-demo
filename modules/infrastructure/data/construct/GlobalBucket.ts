import { RemovalPolicy } from "aws-cdk-lib";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { BucketReplication } from "@infrastructure/data/construct/BucketReplication";

export interface GlobalBucketProps {
    appName: string;
    account: string;
    region: string;
    primaryRegion: string;
    activeRegions: string[];
    removalPolicy: RemovalPolicy;
}

export class GlobalBucket extends Construct {
    bucket: Bucket;

    constructor(scope: Construct, id: string, props: GlobalBucketProps) {
        super(scope, id);

        const bucketName = `${props.account}-${props.region}-${props.appName}`;

        this.bucket = new Bucket(this, "bucket", {
            bucketName,
            enforceSSL: true,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            autoDeleteObjects: true,
            removalPolicy: props.removalPolicy,
            versioned: true,
        });

        const replicationRegions = props.activeRegions.filter((region) => region !== props.region);

        for (const replicationRegion of replicationRegions) {
            const destinationBucketName = bucketName.replace(props.region, replicationRegion);

            new BucketReplication(this, "bucket-replication", {
                sourceBucket: this.bucket,
                sourceBucketName: bucketName,
                destinationBucketName,
            });
        }
    }
}
