#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ReactStack } from "../lib/cdk-stack";

const app = new cdk.App();

new ReactStack(app, "jcw-static-react-app", {
  env: {
    region: process.env.AWS_REGION,
    account: process.env.AWS_ACCOUNT,
  },
});
