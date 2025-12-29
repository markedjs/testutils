import { outputCompletionTable } from "../src/index.js";
import test from "node:test";
import assert from "node:assert";
import { Tests } from "../src/types.js";

test("output-table", (t) => {
  t.test("outputCompletionTable", () => {
    let output = "";
    t.mock.method(console, "log", (...args: any[]) => {
      output += args.join(" ") + "\n";
    });
    const tests: Tests = {
      Tests: {
        total: 1,
        pass: 1,
        specs: [],
      },
    };
    outputCompletionTable("Title", tests);

    assert.strictEqual(
      output,
      "----------------------\n|        Title       |\n|                    |\n| Tests 1 of 1  100% |\n----------------------\n\n",
    );
  });
});
