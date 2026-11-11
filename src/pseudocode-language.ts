/** TextMate grammar for algorithm notation, including arrows and mathematical identifiers. */
export const pseudocodeLanguage = {
  name: "pseudocode",
  scopeName: "source.pseudocode",
  patterns: [
    { name: "comment.line.number-sign.pseudocode", begin: "#", end: "$" },
    {
      name: "string.quoted.double.pseudocode", begin: '"', end: '"',
      patterns: [{ name: "constant.character.escape.pseudocode", match: "\\\\." }],
    },
    {
      name: "string.quoted.single.pseudocode", begin: "'", end: "'",
      patterns: [{ name: "constant.character.escape.pseudocode", match: "\\\\." }],
    },
    { name: "keyword.control.pseudocode", match: "\\b(function|for|in|if|else|while|break|continue|and|or|not|return|sort|by|mod|asc|desc|first|with|distinct|relax)\\b" },
    { name: "constant.numeric.pseudocode", match: "\\b[0-9]+(?:\\.[0-9]+)?\\b" },
    { name: "entity.name.function.pseudocode", match: "\\b[A-Za-z_]\\w*(?=\\s*\\()" },
    { name: "variable.other.pseudocode", match: "\\b[A-Za-z_]\\w*\\*?" },
    { name: "keyword.operator.pseudocode", match: "[←→≤≥≠Σ=+*/<>%-]" },
  ],
};
