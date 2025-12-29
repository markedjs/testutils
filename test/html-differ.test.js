import { htmlIsEqual, firstDiff } from "../src/index.js";
import test from "node:test";
import assert from "node:assert";

test("html-differ", async (t) => {
  await t.test("htmlIsEqual is equal", async () => {
    const same = htmlIsEqual("<p> test </p>", "<p>  test  </p>");

    assert.ok(same);
  });

  await t.test("htmlIsEqual is not equal", async () => {
    const same = htmlIsEqual("<p>test1</p>", "<p>test2</p>");

    assert.ok(!same);
  });

  await t.test("firstDiff", async () => {
    const diff = firstDiff("<p>test1</p>", "<p>test2</p>");

    assert.strictEqual(diff.actual, "<p>test1</p>");
    assert.strictEqual(diff.expected, "<p>test2</p>");
  });

  await t.test("firstDiff padding", async () => {
    const diff = firstDiff("<p>test1</p>", "<p>test2</p>", 5);

    assert.strictEqual(diff.actual, "<p>test1");
    assert.strictEqual(diff.expected, "<p>test2");
  });
});
