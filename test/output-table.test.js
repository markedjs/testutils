import { outputCompletionTable } from "../src/index.js";
import test from "node:test";
import assert from "node:assert";

test("output-table", (t) => {
  t.test("outputCompletionTable", () => {
    let output = "";
    t.mock.method(console, "log", (...args) => {
      output += args.join(" ") + "\n";
    });
    const tests = {
      Tests: {
        total: 1,
        pass: 1,
      },
    };
    outputCompletionTable("Title", tests);

    assert.strictEqual(
      output,
      "----------------------\n|        Title       |\n|                    |\n| Tests 1 of 1  100% |\n----------------------\n\n"
    );
  });
});
