import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import * as ts from 'typescript';

const SRC_DIR = join(process.cwd(), 'src');
const TS_EXTS = new Set(['.ts', '.tsx']);

function listTsFiles(dir: string, acc: string[] = []): string[] {
  const entries = readdirSync(dir);
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      listTsFiles(full, acc);
    } else if (TS_EXTS.has(extname(full))) {
      acc.push(full);
    }
  }
  return acc;
}

const allFiles = listTsFiles(SRC_DIR).filter((f) => !f.includes('__tests__'));

const ROOT_CONFIG_FILES = [
  join(process.cwd(), 'vite.config.ts'),
  join(process.cwd(), 'tailwind.config.js'),
  join(process.cwd(), 'postcss.config.js'),
  join(process.cwd(), '.eslintrc.cjs'),
];

const PURE_DIRS = ['src/lib', 'src/state', 'src/data'];

function isPureLayer(absPath: string): boolean {
  const rel = relative(process.cwd(), absPath).replace(/\\/g, '/');
  return PURE_DIRS.some((d) => rel.startsWith(d + '/'));
}

function hasAnyComment(filePath: string): boolean {
  const content = readFileSync(filePath, 'utf-8');
  const kind = filePath.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, kind);
  const ranges: ts.CommentRange[] = [];
  function visit(node: ts.Node) {
    const leading = ts.getLeadingCommentRanges(content, node.getFullStart()) ?? [];
    const trailing = ts.getTrailingCommentRanges(content, node.getEnd()) ?? [];
    ranges.push(...leading, ...trailing);
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return ranges.length > 0;
}

describe('static rules (F-25)', () => {
  it('no Intl. usage anywhere in src', () => {
    const intlStr = 'Int' + 'l';
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content.includes(intlStr + '.')).toBe(false);
    }
  });

  it('no toLocaleString anywhere in src', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('toLocaleString')).toBe(false);
      expect(content.includes('toLocaleDateString')).toBe(false);
      expect(content.includes('toLocaleTimeString')).toBe(false);
    }
  });

  it('no toFixed anywhere in src', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('toFixed')).toBe(false);
    }
  });

  it('no dark: variant in src', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('dark:')).toBe(false);
    }
  });

  it('no micro font classes text-[10px] or text-[11px]', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('text-[10px]')).toBe(false);
      expect(content.includes('text-[11px]')).toBe(false);
    }
  });

  it('no external http(s) URLs in src (non-test)', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('http://')).toBe(false);
      expect(content.includes('https://')).toBe(false);
    }
  });

  it('no non-breaking spaces (U+00A0, U+202F, U+2009) in src', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('\u00A0')).toBe(false);
      expect(content.includes('\u202F')).toBe(false);
      expect(content.includes('\u2009')).toBe(false);
    }
  });

  it('pure layers (lib, state, data) have no react/react-dom/react-router-dom/lucide-react imports', () => {
    for (const f of allFiles) {
      if (!isPureLayer(f)) continue;
      const content = readFileSync(f, 'utf-8');
      expect(content).not.toMatch(/from\s+['"]react['"]/);
      expect(content).not.toMatch(/from\s+['"]react-dom['"]/);
      expect(content).not.toMatch(/from\s+['"]react-router-dom['"]/);
      expect(content).not.toMatch(/from\s+['"]lucide-react['"]/);
    }
  });

  it('pure layers have no window/document/localStorage/crypto global access', () => {
    for (const f of allFiles) {
      if (!isPureLayer(f)) continue;
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('window')).toBe(false);
      expect(content.includes('document')).toBe(false);
      expect(content.includes('localStorage')).toBe(false);
      expect(content.includes('crypto')).toBe(false);
    }
  });

  it('no Math.random or Date.now in pure layers', () => {
    for (const f of allFiles) {
      if (!isPureLayer(f)) continue;
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('Math.random')).toBe(false);
      expect(content.includes('Date.now')).toBe(false);
    }
  });

  it('no eslint-disable or ts-ignore or ts-expect-error anywhere', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content.includes('eslint-disable')).toBe(false);
      expect(content.includes('@ts-ignore')).toBe(false);
      expect(content.includes('@ts-expect-error')).toBe(false);
    }
  });

  it('no explicit any type annotation', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8');
      expect(content).not.toMatch(/:\s*any\b/);
      expect(content).not.toMatch(/<any>/);
      expect(content).not.toMatch(/as\s+any\b/);
    }
  });

  it('src directory exists', () => {
    expect(existsSync(SRC_DIR)).toBe(true);
  });

  it('no brand words (shopee, shopeefood) in source identifiers or UI', () => {
    for (const f of allFiles) {
      const content = readFileSync(f, 'utf-8').toLowerCase();
      expect(content).not.toContain('shopeefood');
      expect(content).not.toContain('shopee');
    }
  });

  it('no comments in any src .ts/.tsx file (line, block, JSDoc, JSX comments)', () => {
    const allSrcFiles = listTsFiles(SRC_DIR);
    for (const f of allSrcFiles) {
      if (f.endsWith('static-rules.test.ts')) continue;
      expect(hasAnyComment(f), `Comment found in ${relative(process.cwd(), f)}`).toBe(false);
    }
  });

  it('no comments in root config files', () => {
    for (const f of ROOT_CONFIG_FILES) {
      if (!existsSync(f)) continue;
      expect(hasAnyComment(f), `Comment found in ${relative(process.cwd(), f)}`).toBe(false);
    }
  });

  it('no dynamic class interpolation in src/components or src/pages', () => {
    const componentDirs = [join(SRC_DIR, 'components'), join(SRC_DIR, 'pages')];
    for (const dir of componentDirs) {
      if (!existsSync(dir)) continue;
      const files = listTsFiles(dir);
      for (const f of files) {
        const content = readFileSync(f, 'utf-8');
        expect(content).not.toMatch(/`[a-z]+-\$\{/);
      }
    }
  });

  it('no <a href= for internal routes in src/components or src/pages', () => {
    const componentDirs = [join(SRC_DIR, 'components'), join(SRC_DIR, 'pages')];
    for (const dir of componentDirs) {
      if (!existsSync(dir)) continue;
      const files = listTsFiles(dir);
      for (const f of files) {
        const content = readFileSync(f, 'utf-8');
        expect(content).not.toMatch(/<a\s+href=/);
      }
    }
  });
});
