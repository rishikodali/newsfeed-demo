#!/usr/bin/env node

import "source-map-support/register";

import { App, Tags } from "aws-cdk-lib";
import { environment } from "@infrastructure/Environment";
import { getInfrastructureConfig } from "@utils/ConfigHelper";

run();

async function run() {
    const config = await getInfrastructureConfig(environment);

    const app = new App();

    Tags.of(app).add("app", config.appName);
}
