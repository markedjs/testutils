import { htmlIsEqual, firstDiff } from "./html-differ.js";
import { getTests } from "./get-tests.js";
import nodeTest from "node:test";
import assert from "node:assert";

export function runTests({
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
    nodeTest(section, (t) => {
      for (const test of tests[section].specs) {
        const options = Object.assign(
          {},
          defaultMarkedOptions,
          spec.options || {}
        );
        const example = spec.example ? " example " + spec.example : "";
        const passFail = spec.shouldFail ? "fail" : "pass";

        if (typeof options.silent === "undefined") {
          options.silent = true;
        }

        t.test(
          "should " + passFail + example,
          {
            only: spec.only,
            skip: spec.skip,
          },
          async () => {
            const before = process.hrtime();
            const parsed = parse(spec.markdown, spec.options);
            const pass = isEqual(parsed, spec.html);
            if (spec.shouldFail) {
              assert.ok(
                !pass,
                `${spec.markdown}\n------\n\nExpected: Should Fail`
              );
            } else if (spec.options.renderExact) {
              assert.strictEqual(spec.html, parsed);
            } else {
              const specDiff = await diff(parsed, spec.html);
              assert(
                pass,
                `Expected: ${specDiff.expected}\n  Actual: ${specDiff.actual}`
              );
            }

            const elapsed = process.hrtime(before);
            if (elapsed[0] > 0) {
              const s = (elapsed[0] + elapsed[1] * 1e-9).toFixed(3);
              assert.fail(`took too long: ${s}s`);
            }
          }
        );
      }
    });
  }
}
