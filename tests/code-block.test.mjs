import assert from "node:assert/strict";
import { test } from "node:test";
import { rehypeCodeHighlighting } from "../dist/build/rehype-code-highlighting.js";

const flatten = (node) => [node, ...(node.children ?? []).flatMap(flatten)];
const text = (node) => node.type === "text" ? node.value : (node.children ?? []).map(text).join("");
async function highlight(source, language, meta = "") {
  const tree = { type: "root", children: [{ type: "element", tagName: "pre", properties: {}, children: [{
    type: "element", tagName: "code", properties: { className: [`language-${language}`] }, data: { meta }, children: [{ type: "text", value: `${source}\n` }],
  }] }] };
  await rehypeCodeHighlighting()(tree);
  return flatten(tree);
}

test("pseudocode preserves copyable notation and blank lines while distinguishing strings from comments", async () => {
  const source = 'function example(q_i):\n\n  q_* ← 25\n  return "# string" # comment';
  const nodes = await highlight(source, "pseudocode");
  assert.equal(text(nodes.find(node => node.tagName === "code")), source);
  const token = (value) => nodes.find(node => node.tagName === "span" && node.properties?.style && text(node).trim() === value);
  for (const value of ["function", "←", "25", '"# string"', "# comment"]) {
    assert.match(token(value)?.properties.style ?? "", /--shiki-light:.*--shiki-dark:/);
  }
  assert.notEqual(token('"# string"').properties.style, token("# comment").properties.style);
});

test("code metadata retains titles, line and word emphasis, and diff markers", async () => {
  const nodes = await highlight('const oldValue = 1 // [!code --]\nconst newValue = 2 // [!code ++]', "javascript", 'title="example.js" {2} /newValue/');
  const has = (key) => nodes.some(node => Object.hasOwn(node.properties ?? {}, key));
  assert.ok(has("data-rehype-pretty-code-title"));
  assert.ok(has("data-highlighted-line"));
  assert.ok(has("data-highlighted-chars"));
  assert.ok(nodes.some(node => node.properties?.className?.includes("add")));
  assert.ok(nodes.some(node => node.properties?.className?.includes("remove")));
});

test("plain code remains literal, including diagram arrows and spacing", async () => {
  const source = 'start\n  ├─ yes → return 1\n  └─ no  → return 0';
  const nodes = await highlight(source, "plaintext");
  assert.equal(text(nodes.find(node => node.tagName === "code")), source);
  assert.equal(nodes.filter(node => Object.hasOwn(node.properties ?? {}, "data-line")).length, 3);
});
