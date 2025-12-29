import fs from "node:fs";
import path from "node:path";
import fm from "front-matter";
import { createRequire } from "node:module";
import { Tests, Spec, TestSection } from "./types.js";

const require = createRequire(import.meta.url);

export async function loadTests(fileOrDir: string): Promise<Tests> {
  const isFile = fs.statSync(fileOrDir).isFile();
  const files = isFile ? [path.basename(fileOrDir)] : fs.readdirSync(fileOrDir);
  const dir = isFile ? path.dirname(fileOrDir) : fileOrDir;

  const obj: Tests = {};

  for (const file of files) {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const absFile = path.join(dir, file);
    let specs: Spec[] = [];

    switch (ext) {
      case ".md": {
        const content = fm(fs.readFileSync(absFile, "utf8"));
        const skip = content.attributes.skip;
        delete content.attributes.skip;
        const only = content.attributes.only;
        delete content.attributes.only;
        specs.push({
          section: name,
          markdown: content.body,
          html: fs.readFileSync(absFile.replace(/[^.]+$/, "html"), "utf8"),
          options: content.attributes,
          only,
          skip,
        });
        break;
      }
      case ".js":
      case ".mjs":
      case ".cjs":
      case ".json": {
        let json;
        try {
          // try require first
          json = await require(absFile);
        } catch (err: any) {
          if (err.code !== "ERR_REQUIRE_ESM") {
            throw err;
          }
          // must import esm
          json = await import(absFile);
        }
        specs = specs.concat(json);
        break;
      }
      default:
      // do nothing
    }

    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      if (!spec.section) {
        spec.section = `${name}[${i}]`;
      }

      if (!obj[spec.section]) {
        obj[spec.section] = {
          total: 0,
          pass: 0,
          specs: [],
        };
      }

      obj[spec.section].total++;
      if (!spec.shouldFail) {
        obj[spec.section].pass++;
      }
      obj[spec.section].specs.push(spec);
    }
  }

  return obj;
}
