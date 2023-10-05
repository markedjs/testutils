# @markedjs/testutils

Test utilities for marked and marked extensions

## API

### `getAllMarkedSpecTests()`

Get all marked [Tests](#tests)

### `getTests(dirs)`

Get [Tests](#tests) from a directory or file.
`dirs` can be a string, an array of strings, or an object with string values.
The return type is the same as the input a Tests object, an array of Tests objects, or an object with Tests object values.

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
