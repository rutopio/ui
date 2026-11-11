import * as React from "react";
import { CodeBlock } from "./code-block.js";
export declare const articleLinkClassName = "break-words font-normal text-primary underline decoration-[0.5px] underline-offset-4 transition-[color,text-decoration-thickness] duration-150 hover:text-neutral-950 hover:decoration-[1px] dark:hover:text-neutral-50";
export declare function Article({ className, ...props }: React.ComponentProps<"article">): React.JSX.Element;
export declare function ArticleBody({ className, ...props }: React.ComponentProps<"div">): React.JSX.Element;
export declare function ArticleSection({ heading, children, ...props }: Omit<React.ComponentProps<"section">, "className"> & {
    heading: React.ReactNode;
}): React.JSX.Element;
export declare const articleComponents: {
    h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
    h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
    h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
    h4: ({ className, id, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
    h5: (props: React.HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
    h6: (props: React.HTMLAttributes<HTMLHeadingElement>) => React.JSX.Element;
    p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => React.JSX.Element;
    strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => React.JSX.Element;
    ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => React.JSX.Element;
    ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => React.JSX.Element;
    li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => React.JSX.Element;
    blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => React.JSX.Element;
    table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => React.JSX.Element;
    tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => React.JSX.Element;
    th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => React.JSX.Element;
    td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => React.JSX.Element;
    pre: typeof CodeBlock;
    code: ({ className, ...props }: React.HTMLAttributes<HTMLElement> & {
        "data-language"?: string;
    }) => React.JSX.Element;
    hr: (props: React.ComponentProps<"hr">) => React.JSX.Element;
};
