import { getTests } from "../src/index.js";
import { resolvePath } from "../src/helpers.js";
import test from "node:test";
import assert from "node:assert";

test("get-tests", async (t) => {
  await t.test("getTests(string)", async () => {
    const tests = (await getTests(
      resolvePath("../node_modules/marked-repo/test/specs/commonmark")
    )) as any;

    assert.ok(tests.Tabs);
  });

  await t.test("getTests(array)", async () => {
    const tests = (await getTests([
      resolvePath("../node_modules/marked-repo/test/specs/commonmark"),
    ])) as any[];

    assert.ok(tests[0].Tabs);
  });
});
