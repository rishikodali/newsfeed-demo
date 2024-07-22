import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import type { Bucket, CfnBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export type BucketReplicationProps = {
    sourceBucket: Bucket;
    sourceBucketName: string;
    destinationBucketName: string;
};

export class BucketReplication extends Construct {
    constructor(scope: Construct, id: string, props: BucketReplicationProps) {
        super(scope, id);

        const replicationRole = new Role(this, "replication-role", {
            roleName: `${props.sourceBucketName}-replication`,
            assumedBy: new ServicePrincipal("s3.amazonaws.com"),
            inlinePolicies: {
                replication: new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: [
                                "s3:ListBucket",
                                "s3:GetReplicationConfiguration",
                                "s3:GetObjectVersionForReplication",
                                "s3:GetObjectVersionAcl",
                                "s3:GetObjectVersionTagging",
                                "s3:GetObjectRetention",
                                "s3:GetObjectLegalHold",
                            ],
                            resources: [
                                `arn:aws:s3:::${props.sourceBucketName}`,
                                `arn:aws:s3:::${props.sourceBucketName}/*`,
                                `arn:aws:s3:::${props.destinationBucketName}`,
                                `arn:aws:s3:::${props.destinationBucketName}/*`,
                            ],
                        }),
                        new PolicyStatement({
                            actions: [
                                "s3:ReplicateObject",
                                "s3:ReplicateDelete",
                                "s3:ReplicateTags",
                                "s3:ObjectOwnerOverrideToBucketOwner",
                            ],
                            resources: [
                                `arn:aws:s3:::${props.sourceBucketName}/*`,
                                `arn:aws:s3:::${props.destinationBucketName}/*`,
                            ],
                        }),
                    ],
                }),
            },
        });

        const cfnBucket = props.sourceBucket.node.defaultChild as CfnBucket;
        cfnBucket.replicationConfiguration = {
            role: replicationRole.roleArn,
            rules: [
                {
                    destination: {
                        bucket: `arn:aws:s3:::${props.destinationBucketName}`,
                    },
                    priority: 1,
                    filter: {
                        prefix: "",
                    },
                    deleteMarkerReplication: {
                        status: "Enabled",
                    },
                    status: "Enabled",
                },
            ],
        };
    }
}
