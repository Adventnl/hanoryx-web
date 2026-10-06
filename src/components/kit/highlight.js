/* A very small syntax colouriser — enough to make a snippet readable, with no
   dependency. It walks the text once, trying each rule where it stands; the first
   rule that matches wins, and anything unmatched is left as plain text. */
const KEYWORDS = {
  js: 'const let var function return if else for while do switch case break continue import from export default await async new class extends null true false undefined typeof instanceof of in try catch finally throw void this super yield',
  css: '@media @import @keyframes @font-face @property @layer important inherit initial none auto',
  sh: 'if then else fi for do done while case esac function export cd echo npm npx node git sudo',
  json: 'true false null',
};

const wordRule = (words) => new RegExp(`(?:${words.trim().split(/\s+/).map((w) => (w.startsWith('@') ? w : `\\b${w}\\b`)).join('|')})`, 'y');

const RULES = {
  js: [['com', /\/\/[^\n]*|\/\*[\s\S]*?\*\//y], ['str', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`/y], ['num', /\b\d[\d_]*(?:\.\d+)?\b/y], ['kw', wordRule(KEYWORDS.js)], ['p', /[{}()[\];,.<>=+\-*/%&|!?:]+/y]],
  json: [['str', /"(?:\\.|[^"\\\n])*"/y], ['num', /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/y], ['kw', wordRule(KEYWORDS.json)], ['p', /[{}[\]:,]/y]],
  css: [['com', /\/\*[\s\S]*?\*\//y], ['str', /'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"/y], ['num', /-?\b\d*\.?\d+(?:px|rem|em|vh|vw|%|s|ms|fr|deg)?\b/y], ['kw', /@[a-z-]+|--[a-z0-9-]+/y], ['p', /[{}();:,>+~*]/y]],
  sh: [['com', /#[^\n]*/y], ['str', /'[^']*'|"(?:\\.|[^"\\\n])*"/y], ['kw', wordRule(KEYWORDS.sh)], ['num', /\b\d+\b/y], ['p', /[|&;<>()$=]+/y]],
  html: [['com', /<!--[\s\S]*?-->/y], ['str', /"[^"]*"|'[^']*'/y], ['kw', /<\/?[A-Za-z][\w-]*/y], ['p', /\/?>|=/y]],
};
RULES.jsx = RULES.js;
RULES.ts = RULES.js;
RULES.tsx = RULES.js;
RULES.bash = RULES.sh;
RULES.yaml = [['com', /#[^\n]*/y], ['str', /"[^"]*"|'[^']*'/y], ['kw', /^[ \t-]*[\w.-]+(?=:)/my], ['num', /\b\d+(?:\.\d+)?\b/y], ['p', /[:\-[\]{},]/y]];

/** Split `code` into `[{ type, text }]`; `type` is 'com' | 'str' | 'num' | 'kw' | 'p' | 'plain'. */
export function highlight(code, language = 'js') {
  const rules = RULES[language];
  if (!rules) return [{ type: 'plain', text: code }];
  const out = [];
  let plain = '';
  let i = 0;
  const flush = () => { if (plain) { out.push({ type: 'plain', text: plain }); plain = ''; } };
  while (i < code.length) {
    let hit = null;
    for (const [type, re] of rules) {
      re.lastIndex = i;
      const m = re.exec(code);
      if (m && m.index === i && m[0].length) { hit = { type, text: m[0] }; break; }
    }
    if (hit) { flush(); out.push(hit); i += hit.text.length; } else { plain += code[i]; i += 1; }
  }
  flush();
  return out;
}
