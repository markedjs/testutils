# @markedjs/testutils

Test utilities for marked and marked extensions.

## Versioning

This is versioned as the version of marked that it includes tests for with the prerelease version being an integer that gets incremented when we release a new fix or feature without updating the marked version.

We recommend to pin to a single version instead of using a range since any update may contain breaking changes.

**Example**

```json
// package.json
"dependencies": {
  "@markedjs/testutils": "9.1.0-0"
}
```

## API

### `getAllMarkedSpecTests()`

Get all marked [Tests](#tests)

### `getTests(dirs)`

Get [Tests](#tests) from a directory or file.
`dirs` can be a string or an array of strings.
The return type is the same as the input a Tests object or an array of Tests objects.

### `htmlIsEqual(actual, expected)`

Check if html will display the same.

### `firstDiff(actual, expected, padding)`

Get the first difference between actual and expected HTML. Returns an object with the characters around the index of the first difference in the expected and actual strings.

### `outputCompletionTable(title, tests)`

Display a table in stdout that lists the sections and what percentage of the tests are not marked shouldFail.

### `runTests({tests, defaultMarkedOptions, parse, addExtension, isEqual, diff})`

Run spec tests

### `runAllMarkedSpecTests({addExtension, outputCompletionTables})`

Run all marked specs with an added extension and optionally output completion table.

## Arguments

### tests

```ts
interface Tests {
  total: number;
  pass: number;
  specs: Spec[];
}

interface Spec {
  section?: string;
  markdown: string;
  html: string;
  example?: number;
  options?: MarkedOptions;
  only?: boolean;
  skip?: boolean;
  shouldFail?: boolean;
}
```

### defaultMarkedOptions

```ts
type defaultMarkedOptions = MarkedOptions;
```

### parse

```ts
function parse(
  markdown: string,
  options: MarkedOptions,
  addExtension: addExtension,
): string;
```

### addExtension

```ts
function addExtension(marked: Marked): void;
```

### isEqual

```ts
function isEqual(actual: string, expected: string): boolean;
```

### diff

```ts
function diff(
  actual: string,
  expected: string,
  padding: number,
): { expected: string; actual: string };
```
