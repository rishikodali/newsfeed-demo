import { GetCallerIdentityCommand, STSClient } from "@aws-sdk/client-sts";
import type { InfrastructureConfig } from "@infrastructure/Environment";

export async function getInfrastructureConfig(
    environment: InfrastructureConfig[],
): Promise<InfrastructureConfig> {
    const awsAccount = await getAwsAccount();
    const config = environment.find((config) => config.account === awsAccount);
    if (!config) {
        throw new Error("Invalid AWS account");
    }
    return config;
}

export function getEnv(name: string): string {
    const environmentVariable = process.env[name];
    if (!environmentVariable) {
        throw new Error(`Could not find environment variable '${name}'`);
    }
    return environmentVariable;
}

async function getAwsAccount(): Promise<string> {
    const sts = new STSClient({});
    const command = new GetCallerIdentityCommand({});
    const response = await sts.send(command);

    return response.Account ?? "";
}
