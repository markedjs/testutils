import { getTests } from "../src/index.js";
import test from "node:test";
import assert from "node:assert";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("getTests", async () => {
  const tests = await getTests(
    resolve(__dirname, "../node_modules/marked-repo/test/specs/commonmark")
  );

  assert.ok(tests);
});
