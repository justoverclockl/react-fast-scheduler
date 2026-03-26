import fs from "node:fs/promises";
import path from "node:path";

import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";

const scopeSelector = ".rfs-root";
const cssFilePath = path.resolve("dist/styles.css");

const css = await fs.readFile(cssFilePath, "utf8");

const result = await postcss([
  prefixSelector({
    prefix: scopeSelector,
    transform(prefix, selector, prefixedSelector) {
      if (selector === ":root" || selector === ":host" || selector === "html") {
        return prefix;
      }

      if (selector.includes(scopeSelector)) {
        return selector;
      }

      if (selector === "*") {
        return `${prefix}, ${prefix} *`;
      }

      if (selector.startsWith(".")) {
        return `${prefix}${selector}, ${prefixedSelector}`;
      }

      if (selector.startsWith("::")) {
        return `${prefix}${selector}, ${prefixedSelector}`;
      }

      return prefixedSelector;
    },
  }),
]).process(css, { from: cssFilePath, to: cssFilePath });

const normalizedCss = result.css.replace(
  /\.rfs-root\.dark \.rfs-root, \.rfs-root \.dark \.rfs-root,?\.rfs-root\.dark/g,
  ".dark .rfs-root,.rfs-root.dark"
);

await fs.writeFile(cssFilePath, normalizedCss);
