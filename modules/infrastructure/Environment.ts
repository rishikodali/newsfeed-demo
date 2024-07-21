import { RemovalPolicy } from "aws-cdk-lib";
import { getEnv } from "@utils/ConfigHelper";

export type InfrastructureConfig = {
    appName: string;
    stage: string;
    account: string;
    regions: string[];
    primaryRegion: string;
    removalPolicy: RemovalPolicy;
};

export const environment: InfrastructureConfig[] = [
    {
        account: getEnv("DEVELOPMENT_AWS_ACCOUNT"),
        appName: "newsfeed",
        stage: "development",
        regions: ["us-east-1", "us-west-1"],
        primaryRegion: "us-east-1",
        removalPolicy: RemovalPolicy.DESTROY,
    },
];
