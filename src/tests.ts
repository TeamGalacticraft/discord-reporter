import * as parser from "fast-xml-parser";
import * as glob from "@actions/glob";
import * as core from "@actions/core";

export interface Tests {
    total: number,
    failed: number
    skipped: number
}

interface JUnitTestsuite {
    testsuite: {
        attr_failures: number,
        attr_skipped: number,
        attr_tests: number,
        attr_time: number,
        attr_timestamp: string
        testcase: {
            attr_classname: string,
            attr_name: string,
            attr_time: number
        }[]
    }
}

const isEmptyObject = (obj: any) =>
    Object.getOwnPropertyNames(obj).length === 0 &&
    Object.getOwnPropertySymbols(obj).length === 0 &&
    Object.getPrototypeOf(obj) === Object.prototype;

export async function parseTests(dir: string): Promise<Tests> {
    if (dir.endsWith("/")) dir = dir.substr(0, dir.length - 1);
    const globber = await glob.create(`${dir}/TEST-*.xml`);
    let tests: Tests = {
        total: 0,
        failed: 0,
        skipped: 0
    }

    for await (const file of globber.globGenerator()) {
        core.info(file)
        const obj: JUnitTestsuite = parser.parse(file, {
            ignoreAttributes: false,
            attributeNamePrefix: "attr_"
        });

        if(!isEmptyObject(obj)) {
            tests.total += Number(obj.testsuite.attr_tests);
            tests.failed += Number(obj.testsuite.attr_failures);
            tests.skipped += Number(obj.testsuite.attr_skipped);
        }
    }

    return tests;
}