import { runAllMarkedSpecTests } from "../src/index.js";
import test from "node:test";

test("run-tests", async (t) => {
  await t.test("runAllMarkedSpecTests", async () => {
    await runAllMarkedSpecTests();
  });
});
