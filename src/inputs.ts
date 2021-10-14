import * as core from "@actions/core";

export interface Inputs {
    webhook: string
    tests: string,
    outcome: string,
    token: string
}

export function mapInputs(): Inputs {
    return {
        webhook: core.getInput("webhook", { required: true, trimWhitespace: true }),
        tests: core.getInput("tests", { required: false }) ?? "build/test-results/test/",
        outcome: core.getInput("outcome", { required: true, trimWhitespace: true }),
        token: core.getInput("token", { required: true })
    }
}