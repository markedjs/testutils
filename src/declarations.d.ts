declare module "front-matter" {
  export default function fm(content: string): {
    attributes: Record<string, unknown>;
    body: string;
  };
}

declare module "@markedjs/html-differ" {
  export class HtmlDiffer {
    constructor(options?: {
      ignoreAttributes?: string[];
      compareAttributesAsJSON?: string[];
      ignoreWhitespaces?: boolean;
      ignoreComments?: boolean;
      ignoreEndTags?: boolean;
      ignoreSelfClosingSlash?: boolean;
    });
    isEqual(actual: string, expected: string): boolean;
    diffHtml(actual: string, expected: string): {value: string, added: boolean, removed: boolean}[];
  }
}
