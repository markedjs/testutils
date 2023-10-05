import { loadTests } from "./load-tests.js";
import { resolvePath } from "./helpers.js";

export async function getTests(dirs) {
  if (typeof dirs === "string") {
    return await loadTests(dirs);
  }

  if (Array.isArray(dirs)) {
    return await Promise.all(dirs.map((dir) => loadTests(dir)));
  }

  const keys = Object.keys(dirs);
  const tests = await Promise.all(keys.map((key) => loadTests(dirs[key])));
  const testsObj = {};
  for (let i = 0; i < keys.length; i++) {
    testsObj[keys[i]] = tests[i];
  }

  return testsObj;
}

export async function getAllMarkedSpecTests() {
  return await getTests({
    CommonMark: resolvePath(
      "../node_modules/marked-repo/test/specs/commonmark",
    ),
    GFM: resolvePath("../node_modules/marked-repo/test/specs/gfm"),
    New: resolvePath("../node_modules/marked-repo/test/specs/new"),
    Original: resolvePath("../node_modules/marked-repo/test/specs/original"),
    ReDOS: resolvePath("../node_modules/marked-repo/test/specs/redos"),
  });
}
