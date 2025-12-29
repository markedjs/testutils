import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export function resolvePath(p: string): string {
  return resolve(__dirname, p);
}
