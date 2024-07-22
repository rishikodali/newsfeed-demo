#!/usr/bin/env node

import "source-map-support/register";

import { App, Tags } from "aws-cdk-lib";
import { DataStack } from "@infrastructure/data/DataStack";
import { environment } from "@infrastructure/Environment";
import { getInfrastructureConfig } from "@utils/ConfigHelper";

run();

async function run() {
    const config = await getInfrastructureConfig(environment);

    const app = new App();

    for (const region of config.activeRegions) {
        new DataStack(app, `${config.appName}-${region}-data`, {
            env: {
                acccount: config.account,
                region,
            },
            appName: config.appName,
            activeRegions: config.activeRegions,
            primaryRegion: config.primaryRegion,
            removalPolicy: config.removalPolicy,
        });
    }

    Tags.of(app).add("app", config.appName);
}
