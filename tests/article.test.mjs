import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { rehypeArticleSections } from "../dist/lib/build/rehype-article-sections.js";
import { PageTransition } from "../dist/components/motion/page-transition.js";
import { SectionHeading } from "../dist/components/article/section-heading.js";

const element = (tagName, text, properties = {}) => ({ type: "element", tagName, properties, children: [{ type: "text", value: text }] });
const leaves = (node) => node.children ? node.children.flatMap(leaves) : [node];

test("article grouping preserves content order, frontmatter, heading IDs and section labels", () => {
  const esm = { type: "mdxjsEsm", value: "export const metadata = {}" };
  const tree = { type: "root", children: [esm, element("p", "Introduction"), element("h2", "First", { id: "first" }), element("p", "Body"), element("h3", "Detail", { id: "detail" }), element("ul", "List"), element("h2", "Second", { id: "second" }), element("p", "End")] };
  const before = leaves(tree);
  rehypeArticleSections()(tree);
  assert.deepEqual(leaves(tree), before);
  assert.equal(tree.children[0], esm);
  const sections = [];
  const walk = (node) => { if (node.tagName === "section") sections.push(node); node.children?.forEach(walk); };
  walk(tree);
  assert.deepEqual(sections.map(section => section.properties.ariaLabelledBy), ["first", "second"]);
  assert.deepEqual(sections.map(section => section.children[0].properties.id), ["first", "second"]);
});

test("heading-free and empty articles retain their contents", () => {
  for (const children of [[], [element("p", "One"), element("p", "Two")]]) {
    const tree = { type: "root", children };
    const before = leaves(tree);
    rehypeArticleSections()(tree);
    assert.deepEqual(leaves(tree), before);
  }
});

test("server-rendered pages remain visible before hydration", () => {
  const html = renderToStaticMarkup(createElement(PageTransition, null, "Readable content"));
  assert.match(html, /Readable content/);
  assert.doesNotMatch(html, /opacity:0/);
});

test("section heading levels preserve link targets and show a divider only for h2", () => {
  for (const level of [2, 3]) {
    const html = renderToStaticMarkup(createElement(SectionHeading, { level, id: "details" }, "Details"));
    assert.match(html, new RegExp(`<h${level}\\b`));
    assert.match(html, /href="#details"/);
    assert.equal(html.includes("min-w-4"), level === 2);
  }
});
