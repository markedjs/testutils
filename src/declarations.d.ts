declare module "front-matter" {
  export default function fm(content: string): {
    attributes: any;
    body: string;
  };
}

declare module "@markedjs/html-differ" {
  export class HtmlDiffer {
    constructor(options?: any);
    isEqual(actual: string, expected: string): boolean;
    diffHtml(actual: string, expected: string): any[];
  }
}
