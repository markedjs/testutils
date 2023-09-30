export function outputCompletionTable(title, specs) {
  let longestName = 0;
  let maxSpecs = 0;

  for (const section in specs) {
    longestName = Math.max(section.length, longestName);
    maxSpecs = Math.max(specs[section].total, maxSpecs);
  }

  const maxSpecsLen = ("" + maxSpecs).length;
  const spaces = maxSpecsLen * 2 + longestName + 11;

  console.log("-".padEnd(spaces + 4, "-"));
  console.log(
    `| ${title
      .padStart(Math.ceil((spaces + title.length) / 2))
      .padEnd(spaces)} |`
  );
  console.log(`| ${" ".padEnd(spaces)} |`);
  for (const section in specs) {
    console.log(
      `| ${section.padEnd(longestName)} ${("" + specs[section].pass).padStart(
        maxSpecsLen
      )} of ${("" + specs[section].total).padStart(maxSpecsLen)} ${(
        (100 * specs[section].pass) /
        specs[section].total
      )
        .toFixed()
        .padStart(4)}% |`
    );
  }
  console.log("-".padEnd(spaces + 4, "-"));
  console.log();
}
