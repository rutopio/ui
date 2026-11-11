import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
} from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";
import { createHighlighter } from "shiki";
import { pseudocodeLanguage } from "./pseudocode-language.js";

/** Shared build-time highlighting policy. Import only from MDX build configuration. */
export function rehypeCodeHighlighting(): ReturnType<typeof rehypePrettyCode> {
  return rehypePrettyCode({
    theme: { light: "github-light", dark: "github-dark" },
    keepBackground: false,
    // CSS supplies the grid and empty-line height without injecting copyable spaces.
    grid: false,
    defaultLang: { block: "plaintext" },
    bypassInlineCode: true,
    transformers: [
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
      transformerNotationDiff({ matchAlgorithm: "v3" }),
    ],
    getHighlighter: (options) => createHighlighter({
      ...options,
      langs: [...(options.langs ?? []), pseudocodeLanguage],
    }),
  });
}
