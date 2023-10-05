import { htmlIsEqual, firstDiff } from "./html-differ.js";
import { getTests, getAllMarkedSpecTests } from "./get-tests.js";
import nodeTest from "node:test";
import assert from "node:assert";
import { Marked } from "marked";
import { outputCompletionTable } from "./output-table.js";

export async function runTests({
  tests = {},
  defaultMarkedOptions = {},
  parse = parseMarked,
  addExtension = () => {},
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
          `${section} should ${passFail}${example}`,
          {
            only: test.only,
            skip: test.skip,
          },
          async () => {
            const before = process.hrtime();
            let parsed = parse(test.markdown, options, addExtension);
            if (options.async) {
              parsed = await parsed;
            }
            const elapsed = process.hrtime(before);
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
              assert.ok(
                pass,
                `Expected: ${testDiff.expected}\n  Actual: ${testDiff.actual}`,
              );
            }

            if (!options.async && elapsed[0] > 0) {
              const s = (elapsed[0] + elapsed[1] * 1e-9).toFixed(3);
              assert.fail(`took too long: ${s}s`);
            }
          },
        );
      }
    });
  }
}

export async function runAllMarkedSpecTests({
  addExtension = () => {},
  outputCompletionTables = true,
} = {}) {
  const specTests = await getAllMarkedSpecTests();

  await Promise.all(
    Object.keys(specTests).map((title) => {
      const tests = specTests[title];
      switch (title) {
        case "CommonMark":
          if (outputCompletionTables) {
            outputCompletionTable(title, tests);
          }
          return runTests({
            tests,
            defaultMarkedOptions: { gfm: false, pedantic: false },
            addExtension,
          });
        case "GFM":
          if (outputCompletionTables) {
            outputCompletionTable(title, tests);
          }
          return runTests({
            tests,
            defaultMarkedOptions: { gfm: true, pedantic: false },
            addExtension,
          });
        case "New":
          return runTests({ tests, addExtension });
        case "Original":
          return runTests({
            tests,
            defaultMarkedOptions: { gfm: false, pedantic: true },
            addExtension,
          });
        case "ReDOS":
          return runTests({ tests, addExtension });
        default:
          throw new Error("invalid title");
      }
    }),
  );
}

function parseMarked(markedown, options, addExtension) {
  const marked = new Marked(options);
  addExtension(marked);
  return marked.parse(markedown);
}
