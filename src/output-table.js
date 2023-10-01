export function outputCompletionTable(title, tests) {
  let longestName = 0;
  let maxTests = 0;

  for (const section in tests) {
    longestName = Math.max(section.length, longestName);
    maxTests = Math.max(tests[section].total, maxTests);
  }

  const maxTestsLen = ("" + maxTests).length;
  const spaces = maxTestsLen * 2 + longestName + 11;

  console.log("-".padEnd(spaces + 4, "-"));
  console.log(
    `| ${title
      .padStart(Math.ceil((spaces + title.length) / 2))
      .padEnd(spaces)} |`
  );
  console.log(`| ${" ".padEnd(spaces)} |`);
  for (const section in tests) {
    console.log(
      `| ${section.padEnd(longestName)} ${("" + tests[section].pass).padStart(
        maxTestsLen
      )} of ${("" + tests[section].total).padStart(maxTestsLen)} ${(
        (100 * tests[section].pass) /
        tests[section].total
      )
        .toFixed()
        .padStart(4)}% |`
    );
  }
  console.log("-".padEnd(spaces + 4, "-"));
  console.log();
}
