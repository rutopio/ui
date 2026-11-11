import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HashIcon } from "@phosphor-icons/react";
import { SectionHeading } from "./section-heading.js";
import { CodeBlock } from "./code-block.js";
import { cn } from "../shared/class-names.js";
export const articleLinkClassName = "break-words font-normal text-primary underline decoration-[0.5px] underline-offset-4 transition-[color,text-decoration-thickness] duration-150 hover:text-neutral-950 hover:decoration-[1px] dark:hover:text-neutral-50";
export function Article({ className, ...props }) {
    return (_jsx("article", { className: cn("base-article flex w-full min-w-0 flex-col gap-16 text-base text-neutral-800 tabular-nums leading-[1.65] dark:text-neutral-300", className), ...props }));
}
export function ArticleBody({ className, ...props }) {
    return (_jsx("div", { className: cn("base-article-body flex min-w-0 flex-col", className), ...props }));
}
export function ArticleSection({ heading, children, ...props }) {
    return (_jsxs("section", { className: "flex min-w-0 flex-col gap-2", ...props, children: [heading, _jsx(ArticleBody, { children: children })] }));
}
function HeadingAnchor({ id, children, }) {
    if (!id)
        return _jsx("span", { children: children });
    return (_jsxs("a", { href: `#${id}`, className: "inline-flex items-start gap-2 transition-colors duration-150 group-hover:text-neutral-950 dark:group-hover:text-neutral-50", children: [_jsx("span", { children: children }), _jsx("span", { className: "flex h-[1lh] shrink-0 items-center", children: _jsx(HashIcon, { className: "size-4 text-primary", "aria-hidden": "true" }) })] }));
}
function MinorHeading({ level, id, children, className, ...props }) {
    const Heading = level === 5 ? "h5" : "h6";
    return (_jsx(Heading, { id: id, className: cn("group mt-6 scroll-m-20 text-balance font-bold font-heading text-base first:mt-0", className), ...props, children: _jsx(HeadingAnchor, { id: id, children: children }) }));
}
export const articleMdxComponents = {
    h1: ({ className, ...props }) => (_jsx("h1", { className: cn("scroll-m-20 text-balance font-bold font-heading text-lg text-neutral-950 leading-[1.65] dark:text-neutral-50", className), ...props })),
    h2: ({ className, ...props }) => (_jsx(SectionHeading, { className: className, ...props })),
    h3: (props) => (_jsx(SectionHeading, { level: 3, ...props })),
    h4: ({ className, id, children, ...props }) => (_jsx("h4", { id: id, className: cn("group mt-6 flex scroll-m-20 items-center text-balance font-bold font-heading text-base text-neutral-950 leading-[1.65] first:mt-0 sm:text-lg dark:text-neutral-50", className), ...props, children: _jsx(HeadingAnchor, { id: id, children: children }) })),
    h5: (props) => (_jsx(MinorHeading, { level: 5, ...props })),
    h6: (props) => (_jsx(MinorHeading, { level: 6, ...props })),
    p: ({ className, ...props }) => (_jsx("p", { className: cn("text-pretty text-base text-neutral-800 leading-[1.65] dark:text-neutral-300", className), ...props })),
    strong: ({ className, ...props }) => (_jsx("strong", { className: cn("font-semibold", className), ...props })),
    ul: ({ className, ...props }) => (_jsx("ul", { className: cn("my-4 ml-6 list-disc", className), ...props })),
    ol: ({ className, ...props }) => (_jsx("ol", { className: cn("my-4 ml-6 list-decimal", className), ...props })),
    li: ({ className, ...props }) => (_jsx("li", { className: cn("mt-2 text-pretty text-base text-neutral-800 leading-[1.65] dark:text-neutral-300", className), ...props })),
    blockquote: ({ className, ...props }) => (_jsx("blockquote", { className: cn("mt-6 border-l-2 pl-6", className), ...props })),
    table: ({ className, ...props }) => (_jsx("div", { className: "my-4 w-full overflow-y-auto", children: _jsx("table", { className: cn("w-full", className), ...props }) })),
    tr: ({ className, ...props }) => (_jsx("tr", { className: cn("m-0 border-t p-0 even:bg-muted", className), ...props })),
    th: ({ className, ...props }) => (_jsx("th", { className: cn("border px-4 py-2 text-left font-bold", className), ...props })),
    td: ({ className, ...props }) => (_jsx("td", { className: cn("border px-4 py-2 text-left", className), ...props })),
    pre: CodeBlock,
    code: ({ className, ...props }) => {
        if (props["data-language"])
            return _jsx("code", { className: className, ...props });
        return (_jsx("code", { className: cn("relative rounded border bg-muted/60 px-[0.3rem] py-[0.2rem] font-mono text-sm", className), ...props }));
    },
    hr: (props) => (_jsx("hr", { className: "my-4 md:my-8", ...props })),
};
