import { MarkedExtension } from "marked";

export interface Spec {
  section: string;
  markdown: string;
  html: string;
  options?: MarkedExtension & {
    renderExact?: boolean;
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
