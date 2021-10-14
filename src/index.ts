import * as core from "@actions/core";
import {mapInputs} from "./inputs";
import {parseTests} from "./tests";
import {sendWebhook} from "./webhook";

async function run(): Promise<void> {
    try {
        const inputs = mapInputs();
        const tests = await parseTests(inputs.tests);
        await sendWebhook(tests, inputs);
    } catch (e) {
        core.setFailed(`${e}`)
    }
}

run();