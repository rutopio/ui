import rehypePrettyCode from "rehype-pretty-code";
/** Build-time only; importing this in client code bundles the syntax highlighter. */
export declare function rehypeCodeHighlighting(): ReturnType<typeof rehypePrettyCode>;
