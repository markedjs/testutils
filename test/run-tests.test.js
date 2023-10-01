import { Marked } from "marked";
import { runTests, getTests, outputCompletionTable } from "../src/index.js";
import { resolvePath } from "./helpers.js";
import test from "node:test";

function parseMarked(markedown, options) {
  const marked = new Marked(options);
  return marked.parse(markedown);
}

test("run-tests", async (t) => {
  await t.test("runTests", async () => {
    const tests = await getTests({
      CommonMark: resolvePath(
        "../node_modules/marked-repo/test/specs/commonmark"
      ),
      GFM: resolvePath("../node_modules/marked-repo/test/specs/gfm"),
      New: resolvePath("../node_modules/marked-repo/test/specs/new"),
      Original: resolvePath("../node_modules/marked-repo/test/specs/original"),
      RedDOS: resolvePath("../node_modules/marked-repo/test/specs/redos"),
    });

    await Promise.all(
      Object.keys(tests).map((title) => {
        const specs = tests[title];
        switch (title) {
          case "CommonMark":
            outputCompletionTable(title, specs);
            return runTests({
              tests: specs,
              parse: parseMarked,
              defaultMarkedOptions: { gfm: false, pedantic: false },
            });
          case "GFM":
            outputCompletionTable(title, specs);
            return runTests({
              tests: specs,
              parse: parseMarked,
              defaultMarkedOptions: { gfm: true, pedantic: false },
            });
          case "New":
            return runTests({
              tests: specs,
              parse: parseMarked,
            });
          case "Original":
            return runTests({
              tests: specs,
              parse: parseMarked,
              defaultMarkedOptions: { gfm: false, pedantic: true },
            });
          case "RedDOS":
            return runTests({
              tests: specs,
              parse: parseMarked,
            });
          default:
            throw new Error("invalid title");
        }
      })
    );
  });
});
