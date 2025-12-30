import { HtmlDiffer } from "@markedjs/html-differ";

const htmlDiffer = new HtmlDiffer({
  ignoreSelfClosingSlash: true,
  ignoreComments: false,
});

/**
 * Check if html will display the same
 * @param actual The actual HTML
 * @param expected The expected HTML
 * @returns HTML is the same
 */
export function htmlIsEqual(actual: string, expected: string): boolean {
  return htmlDiffer.isEqual(actual, expected);
}

/**
 * Get the first difference between actual and expected HTML
 * @param actual The actual HTML
 * @param expected The expected HTML
 * @param padding The number of characters to show around the first difference
 * @returns An object with the characters around the index of the first difference in the expected and actual strings
 */
export function firstDiff(
  actual: string,
  expected: string,
  padding: number = 30,
): { actual: string; expected: string } {
  const diffHtml = htmlDiffer.diffHtml(actual, expected);
  const result = diffHtml.reduce(
    (obj, diff) => {
      if (diff.added) {
        if (obj.firstIndex === null) {
          obj.firstIndex = obj.expected.length;
        }
        obj.expected += diff.value;
      } else if (diff.removed) {
        if (obj.firstIndex === null) {
          obj.firstIndex = obj.actual.length;
        }
        obj.actual += diff.value;
      } else {
        obj.actual += diff.value;
        obj.expected += diff.value;
      }

      return obj;
    },
    {
      firstIndex: null,
      actual: "",
      expected: "",
    } as { firstIndex: number | null; actual: string; expected: string },
  );

  if (result.firstIndex === null) {
    return {
      actual: "",
      expected: "",
    };
  }

  return {
    actual: result.actual.substring(
      result.firstIndex - padding,
      result.firstIndex + padding,
    ),
    expected: result.expected.substring(
      result.firstIndex - padding,
      result.firstIndex + padding,
    ),
  };
}
