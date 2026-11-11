type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function isHeading(node: HastNode | undefined): boolean {
  return (
    node?.type === "element" && (node.tagName === "h2" || node.tagName === "h3")
  );
}

function groupBlocksWithRhythm(children: HastNode[]): HastNode[] {
  if (children.length < 2) return children;

  let flow = children[children.length - 1];
  for (let index = children.length - 2; index >= 0; index--) {
    const child = children[index];
    const next = children[index + 1];
    if (!child || !flow) continue;

    const gap = isHeading(child)
      ? "gap-2"
      : child.type === "element" && child.tagName === "p" && isHeading(next)
        ? "gap-16"
        : "gap-6";

    flow = {
      type: "element",
      tagName: "div",
      properties: { className: ["flex", "flex-col", gap] },
      children: [child, flow],
    };
  }

  return flow ? [flow] : [];
}

// Match the article rhythm: 64px from paragraphs to the next heading and
// between h2 sections, 8px after headings, and 24px between body blocks.
export function rehypeArticleSections() {
  return (tree: HastNode) => {
    const children = tree.children;
    if (!children) return;

    const grouped: HastNode[] = [];
    const sections: HastNode[] = [];
    const prelude: HastNode[] = [];
    let body: HastNode | undefined;

    for (const child of children) {
      // Frontmatter exports compile to MDX ESM and render no DOM. Keep them at
      // the root so they cannot create an empty prelude before the first h2.
      if (child.type === "mdxjsEsm") {
        grouped.push(child);
        continue;
      }
      if (child.type === "text" && !child.value?.trim()) continue;

      if (child.type === "element" && child.tagName === "h2") {
        if (body) {
          body.children = groupBlocksWithRhythm(body.children ?? []);
        }
        const id = child.properties?.id;
        body = {
          type: "element",
          tagName: "div",
          properties: { className: ["flex", "flex-col", "gap-6"] },
          children: [],
        };
        sections.push({
          type: "element",
          tagName: "section",
          properties: {
            className: ["flex", "flex-col", "gap-2"],
            ...(typeof id === "string" ? { ariaLabelledBy: id } : {}),
          },
          children: [child, body],
        });
      } else if (body) {
        body.children?.push(child);
      } else {
        prelude.push(child);
      }
    }

    if (body) {
      body.children = groupBlocksWithRhythm(body.children ?? []);
    }

    const articleFlow: HastNode[] = [];
    if (prelude.length > 0) {
      articleFlow.push({
        type: "element",
        tagName: "div",
        properties: { className: ["flex", "flex-col", "gap-6"] },
        children: prelude,
      });
    }
    if (sections.length > 0) {
      articleFlow.push({
        type: "element",
        tagName: "div",
        properties: { className: ["flex", "flex-col", "gap-16"] },
        children: sections,
      });
    }
    if (articleFlow.length > 0) {
      grouped.push({
        type: "element",
        tagName: "div",
        properties: { className: ["flex", "flex-col", "gap-16"] },
        children: articleFlow,
      });
    }

    tree.children = grouped;
  };
}
