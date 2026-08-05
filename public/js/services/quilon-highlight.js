// Quilon syntax highlighting — a browser port of `editors/vscode/src/grammar.ts`
// from https://github.com/assapir/quilon, so code blocks here get the same
// colours as the editor.
//
// TextMate's rule: at each position take the FIRST matching rule in list order,
// not the longest match. That ordering is why `|>` beats `|`, `=>` beats `=`, etc.

import { QUILON_GRAMMAR } from "./quilon-grammar.js";

/** Scope prefix → CSS class; longest prefix wins, unmatched scopes stay plain. */
const SCOPE_CLASSES = [
  ["comment", "ql-comment"],
  ["string", "ql-string"],
  ["constant.character.escape", "ql-string"],
  ["constant.numeric", "ql-number"],
  ["constant.language", "ql-const"],
  ["keyword.control", "ql-control"],
  ["keyword.operator", "ql-operator"],
  ["support.type", "ql-type"],
  ["entity.name.type", "ql-type"],
  ["entity.name.function", "ql-name"],
  ["entity.name.namespace", "ql-name"],
];

function classFor(scope) {
  if (!scope) return undefined;
  let best;
  for (const [prefix, cls] of SCOPE_CLASSES) {
    if (scope === prefix || scope.startsWith(prefix + ".")) {
      if (!best || prefix.length > best.prefix.length) best = { prefix, cls };
    }
  }
  return best?.cls;
}

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

function escapeHtml(str) {
  return str.replace(/[&<>"]/g, (c) => ESCAPES[c]);
}

/** Sticky (`y`) so probing finds the earliest start; `d` exposes capture spans. */
function sticky(source) {
  return new RegExp(source, "yd");
}

function buildCaptures(rule) {
  const map = new Map();
  if (rule.captures) {
    for (const [index, value] of Object.entries(rule.captures)) {
      map.set(Number(index), value.name);
    }
  }
  return map;
}

function compile(rule, repo, seen) {
  if (typeof rule.match === "string") {
    return [
      {
        kind: "match",
        name: rule.name,
        re: sticky(rule.match),
        captures: buildCaptures(rule),
      },
    ];
  }
  if (typeof rule.begin === "string") {
    return [
      {
        kind: "beginEnd",
        name: rule.name,
        begin: sticky(rule.begin),
        end: new RegExp(rule.end ?? "$", "g"),
      },
    ];
  }
  if (rule.patterns) return resolve(rule.patterns, repo, seen);
  return [];
}

function resolve(patterns, repo, seen = new Set()) {
  const out = [];
  for (const p of patterns) {
    if (p.include) {
      const key = p.include.replace(/^#/, "");
      if (seen.has(key)) continue;
      const target = repo[key];
      if (!target) continue;
      out.push(...compile(target, repo, new Set(seen).add(key)));
    } else {
      out.push(...compile(p, repo, seen));
    }
  }
  return out;
}

function earliestMatchFrom(re, line, from) {
  for (let at = from; at <= line.length; at++) {
    re.lastIndex = at;
    const m = re.exec(line);
    if (m && m[0].length > 0) return { index: m.index, length: m[0].length };
  }
  return undefined;
}

function firstMatch(rules, line, from) {
  let best;
  for (const rule of rules) {
    const re = rule.kind === "match" ? rule.re : rule.begin;
    const start = earliestMatchFrom(re, line, from);
    if (!start) continue;
    if (!best || start.index < best.start) {
      best = { rule, start: start.index, end: start.index + start.length };
    }
  }
  return best;
}

function matchTokens(rule, line, start) {
  rule.re.lastIndex = start;
  const m = rule.re.exec(line);
  if (!m) return [];

  const whole = m[0];
  if (rule.captures.size === 0) return [{ text: whole, scope: rule.name }];

  // Stamp each capture's scope over its span, then coalesce equal-scope runs.
  const scopes = Array.from({ length: whole.length }, () => rule.name);
  const indices = m.indices;
  if (indices) {
    for (let g = 1; g < indices.length; g++) {
      const span = indices[g];
      const scope = rule.captures.get(g);
      if (!span || scope === undefined) continue;
      for (let i = span[0] - start; i < span[1] - start; i++) scopes[i] = scope;
    }
  }

  const tokens = [];
  let runStart = 0;
  for (let i = 1; i <= whole.length; i++) {
    if (i === whole.length || scopes[i] !== scopes[runStart]) {
      tokens.push({ text: whole.slice(runStart, i), scope: scopes[runStart] });
      runStart = i;
    }
  }
  return tokens;
}

function findEnd(rule, line, from) {
  rule.end.lastIndex = from;
  const m = rule.end.exec(line);
  if (!m) return line.length;
  return m.index + (m[0].length > 0 ? m[0].length : line.length - m.index);
}

const ROOT_RULES = resolve(QUILON_GRAMMAR.patterns, QUILON_GRAMMAR.repository);

/** Tokenize one line; concatenating the tokens reproduces the input exactly. */
export function tokenizeLine(line) {
  const tokens = [];
  let pos = 0;
  let plainStart = 0;

  const flushPlain = (upTo) => {
    if (upTo > plainStart) {
      tokens.push({ text: line.slice(plainStart, upTo), scope: undefined });
    }
  };

  while (pos < line.length) {
    const hit = firstMatch(ROOT_RULES, line, pos);
    if (!hit) break;
    flushPlain(hit.start);

    if (hit.rule.kind === "match") {
      tokens.push(...matchTokens(hit.rule, line, hit.start));
      pos = hit.end;
    } else {
      const innerEnd = findEnd(hit.rule, line, hit.end);
      tokens.push({ text: line.slice(hit.start, innerEnd), scope: hit.rule.name });
      pos = innerEnd;
    }
    plainStart = pos;
  }

  flushPlain(line.length);
  return tokens;
}

/** Highlight source into escaped HTML. Line by line, so an unterminated
 *  string can't bleed into the next line. */
export function highlight(source) {
  return source
    .split("\n")
    .map((line) =>
      tokenizeLine(line)
        .map(({ text, scope }) => {
          const cls = classFor(scope);
          const safe = escapeHtml(text);
          return cls ? `<span class="${cls}">${safe}</span>` : safe;
        })
        .join(""),
    )
    .join("\n");
}
