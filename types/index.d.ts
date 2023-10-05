import type { MarkedOptions } from "marked";

export interface Spec {
  section?: string;
  markdown: string;
  html: string;
  example?: number;
  options?: MarkedOptions;
  only?: boolean;
  skip?: boolean;
  shouldFail?: boolean;
}

export interface Tests {
  total: number;
  pass: number;
  specs: Spec[];
}
