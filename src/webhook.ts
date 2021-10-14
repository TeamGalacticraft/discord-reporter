import {Inputs} from "./inputs";
import {Tests} from "./tests";
import * as github from "@actions/github";

interface Webhook {
    content?: string,
    username?: string,
    avatar_url?: string,
    embeds?: {
        title?: string,
        description?: string,
        url?: string,
        timestamp?: string,
        color?: number,
        footer?: {
            text: string,
            icon_url?: string,
        },
        author?: {
            name: string,
            url?: string,
            icon_url?: string,
        },
        fields?: {
            name: string,
            value: string,
            inline?: boolean
        }[]
    }[]
}

export async function sendWebhook(tests: Tests, inputs: Inputs) {
    const octokit = github.getOctokit(inputs.token);
    const commit = await octokit.rest.search.commits({
        q: `hash:${github.context.sha}`,
        per_page: 1
    })

    let webhook: Webhook = {
        embeds: [{
            color: inputs.outcome == "success" ? 2328118 : inputs.outcome == "failure" ? 16273737 : 10381827,
            author: {
              name: inputs.outcome == "success" ? "Build Succeeded" : inputs.outcome == "failure" ? "Build Failed" : "Build Unknown",
              icon_url: `https://i.joezwet.dev/build-${(inputs.outcome == "success" || inputs.outcome == "failure") ? inputs.outcome : "unknown"}`
            },
            description: `[\`${github.context.sha.substr(0, 7)}\`](${commit.data.items[0]?.html_url}) ${commit.data.items[0].commit.message}`,
            fields: tests.total == 0 ? [] : [
                {
                    name: "Tests Passed",
                    value: `${tests.total-(tests.skipped+tests.failed)}/${tests.total}`,
                    inline: true
                },
                {
                    name: "Tests Skipped",
                    value: `${tests.skipped}/${tests.total}`,
                    inline: true
                },
                {
                    name: "Tests Failed",
                    value: `${tests.failed}/${tests.total}`,
                    inline: true
                }
            ],
            footer: {
                text: `${commit.data.items[0]?.author?.name}`,
                icon_url: `https://github.com/${commit.data.items[0]?.author?.login}.png`
            },
            timestamp: new Date().toISOString()
        }]
    }


}