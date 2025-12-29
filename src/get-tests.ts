import { loadTests } from "./load-tests.js";
import { resolve } from "node:path";
import { Tests } from "./types.js";

/**
 * Get tests from a directory or file
 * @param dirs Can be a string or an array of strings
 * @returns The return type will match the input, a tests object or an array of tests objects
 */
export async function getTests(
  dirs: string | string[],
): Promise<Tests | Tests[]> {
  if (Array.isArray(dirs)) {
    return await Promise.all(dirs.map((dir) => loadTests(dir)));
  }

  return await loadTests(dirs);
}

/**
 * Get all marked tests
 * @returns All marked spec tests
 */
export async function getAllMarkedSpecTests(): Promise<{
  CommonMark: Tests;
  GFM: Tests;
  New: Tests;
  Original: Tests;
  ReDOS: Tests;
}> {
  const tests = (await getTests([
    resolve("./node_modules/marked-repo/test/specs/commonmark"),
    resolve("./node_modules/marked-repo/test/specs/gfm"),
    resolve("./node_modules/marked-repo/test/specs/new"),
    resolve("./node_modules/marked-repo/test/specs/original"),
    resolve("./node_modules/marked-repo/test/specs/redos"),
  ])) as Tests[];

  return {
    CommonMark: tests[0],
    GFM: tests[1],
    New: tests[2],
    Original: tests[3],
    ReDOS: tests[4],
  };
}
