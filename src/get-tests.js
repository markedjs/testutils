import { loadTests } from "./load-tests.js";

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
