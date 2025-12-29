import { htmlIsEqual, firstDiff } from "./html-differ.js";
import { getTests, getAllMarkedSpecTests } from "./get-tests.js";
import nodeTest from "node:test";
import assert from "node:assert";
import { Marked, MarkedOptions } from "marked";
import { outputCompletionTable } from "./output-table.js";
import { Tests, Spec } from "./types.js";

interface RunTestsOptions {
  tests?: Tests | string;
  defaultMarkedOptions?: MarkedOptions;
  parse?: (
    markedown: string,
    options: MarkedOptions,
    addExtension: (marked: Marked) => void
  ) => string | Promise<string>;
  addExtension?: (marked: Marked) => void;
  isEqual?: (actual: string, expected: string) => boolean;
  diff?: (
    actual: string,
    expected: string,
    padding?: number
  ) => { actual: string; expected: string };
  // allow extra props
  [key: string]: any;
}

/**
 * Run spec tests
 */
export async function runTests({
  tests = {},
  defaultMarkedOptions = {},
  parse = parseMarked,
  addExtension = () => {},
  isEqual = htmlIsEqual,
  diff = firstDiff,
}: RunTestsOptions = {}) {
  if (typeof tests === "string") {
    tests = (await getTests(tests)) as Tests;
  }

  for (const section of Object.keys(tests)) {
    const sectionTests = tests[section];
    const hasOnly = sectionTests.specs.some((test) => test.only);
    await nodeTest(section, { only: hasOnly }, async (t) => {
      for (const test of sectionTests.specs) {
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
            const pass = isEqual(parsed as string, test.html);
            if (test.shouldFail) {
              assert.ok(
                !pass,
                `${test.markdown}\n------\n\nExpected: Should Fail`
              );
            } else if (options.renderExact) {
              assert.strictEqual(test.html, parsed);
            } else {
              const testDiff = diff(parsed as string, test.html);
              assert.ok(
                pass,
                `Expected: ${testDiff.expected}\n  Actual: ${testDiff.actual}`
              );
            }

            if (!options.async && elapsed[0] > 0) {
              const s = (elapsed[0] + elapsed[1] * 1e-9).toFixed(3);
              assert.fail(`took too long: ${s}s`);
            }
          }
        );
      }
    });
  }
}

/**
 * Run all marked specs with an added extension and optionally output completion table
 */
export async function runAllMarkedSpecTests({
  addExtension = () => {},
  outputCompletionTables = true,
}: {
  addExtension?: (marked: Marked) => void;
  outputCompletionTables?: boolean;
} = {}) {
  const specTests = await getAllMarkedSpecTests();

  await Promise.all(
    Object.keys(specTests).map((title) => {
      const tests = specTests[title as keyof typeof specTests];
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
    })
  );
}

function parseMarked(
  markedown: string,
  options: MarkedOptions,
  addExtension: (marked: Marked) => void
): string {
  const marked = new Marked(options as any);
  addExtension(marked);
  return marked.parse(markedown) as string;
}
