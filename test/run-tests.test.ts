import { runAllMarkedSpecTests, runTests } from "../src/index.js";
import test from "node:test";
import assert from "node:assert";

test("run-tests", async (t) => {
  await t.test("runAllMarkedSpecTests", async () => {
    await runAllMarkedSpecTests();
  });

  await t.test("renderOk option", async () => {
    // This test should pass because renderOk is true even though html does not match the actual parsed output.
    await runTests({
      tests: {
        "Render OK Section": {
          total: 1,
          pass: 1,
          specs: [
            {
              section: "Render OK Section",
              markdown: "hello",
              options: {
                renderOk: true,
              },
            },
          ],
        },
      },
    });
  });
});
