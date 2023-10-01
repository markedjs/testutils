import { htmlIsEqual, firstDiff } from "./html-differ.js";
import { getTests } from "./get-tests.js";
import nodeTest from "node:test";
import assert from "node:assert";

export async function runTests({
  tests = {},
  defaultMarkedOptions = {},
  parse = (md) => md,
  isEqual = htmlIsEqual,
  diff = firstDiff,
} = {}) {
  if (typeof tests === "string") {
    tests = getTests(tests);
  }

  for (const section of Object.keys(tests)) {
    await nodeTest(section, async (t) => {
      for (const test of tests[section].specs) {
        const options = {
          ...defaultMarkedOptions,
          ...(test.options || {}),
        };
        const example = test.example ? " example " + test.example : "";
        const passFail = test.shouldFail ? "fail" : "pass";

        if (typeof options.silent === "undefined") {
          options.silent = true;
        }

        await t.test(
          "should " + passFail + example,
          {
            only: test.only,
            skip: test.skip,
          },
          async () => {
            const before = process.hrtime();
            const parsed = await parse(test.markdown, options);
            const pass = await isEqual(parsed, test.html);
            if (test.shouldFail) {
              assert.ok(
                !pass,
                `${test.markdown}\n------\n\nExpected: Should Fail`,
              );
            } else if (options.renderExact) {
              assert.strictEqual(test.html, parsed);
            } else {
              const testDiff = await diff(parsed, test.html);
              assert(
                pass,
                `Expected: ${testDiff.expected}\n  Actual: ${testDiff.actual}`,
              );
            }

            const elapsed = process.hrtime(before);
            if (elapsed[0] > 0) {
              const s = (elapsed[0] + elapsed[1] * 1e-9).toFixed(3);
              assert.fail(`took too long: ${s}s`);
            }
          },
        );
      }
    });
  }
}
