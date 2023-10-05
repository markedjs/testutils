import { loadTests } from "./load-tests.js";
import { resolvePath } from "./helpers.js";

/**
 * Get tests from a directory or file
 * @param {string | string[]} dirs Can be a string or an array of strings
 * @returns {Tests | Tests[]} The return type will match the input, a tests object or an array of tests objects
 */
export async function getTests(dirs) {
  if (Array.isArray(dirs)) {
    return await Promise.all(dirs.map((dir) => loadTests(dir)));
  }

  return await loadTests(dirs);
}

/**
 * Get all marked tests
 * @returns {{
 *   CommonMark: Tests,
 *   GFM: Tests,
 *   New: Tests,
 *   Original: Tests,
 *   ReDOS: Tests,
 * }} All marked spec tests
 */
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
