import { MarkedOptions } from "marked";

export interface Spec {
  section: string;
  markdown: string;
  html: string;
  options?: MarkedOptions & {
    silent?: boolean;
    async?: boolean;
    renderExact?: boolean;
    [key: string]: any;
  };
  only?: boolean;
  skip?: boolean;
  example?: string;
  shouldFail?: boolean;
}

export interface TestSection {
  total: number;
  pass: number;
  specs: Spec[];
}

export type Tests = Record<string, TestSection>;
