#!/usr/bin/env node
import fs from 'node:fs';
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`migration-planner

Usage:
  migration-planner [--from text] [--to text] [--manifest package.json] [--json]`);
  process.exit(0);
}
const val = (flag, fallback = '') => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : fallback;
};
const json = args.includes('--json');
const manifest = val('--manifest', fs.existsSync('package.json') ? 'package.json' : '');
const from = val('--from', 'current stack');
const to = val('--to', 'target stack');
let deps = {};
if (manifest && fs.existsSync(manifest)) {
  const parsed = JSON.parse(fs.readFileSync(manifest, 'utf8'));
  deps = { ...parsed.dependencies, ...parsed.devDependencies };
}
const names = Object.keys(deps);
const areas = [
  names.some((n) => /react|vue|svelte|angular|next/.test(n)) && 'frontend rendering and routing',
  names.some((n) => /express|fastify|koa|nest/.test(n)) && 'backend HTTP APIs',
  names.some((n) => /jest|vitest|mocha|playwright|cypress/.test(n)) && 'test runner and browser tests',
  names.some((n) => /eslint|prettier|typescript|babel|vite|webpack/.test(n)) && 'build, lint, and TypeScript tooling'
].filter(Boolean);
const plan = {
  migration: `${from} -> ${to}`,
  detectedAreas: areas,
  phases: [
    'Inventory dependencies, lockfiles, runtime versions, and generated files.',
    'Read official migration notes for the target version and list breaking changes.',
    'Create a small compatibility branch and upgrade tooling first.',
    'Fix compile-time and lint failures before behavior changes.',
    'Run focused regression tests for detected areas.',
    'Document rollback steps and release checks.'
  ],
  risks: [
    'Hidden breaking changes in transitive dependencies.',
    'CI and local runtime version drift.',
    'Generated lockfile or build output churn.',
    'Insufficient regression coverage around changed behavior.'
  ]
};
if (json) { console.log(JSON.stringify(plan, null, 2)); process.exit(0); }
console.log(`# Migration Plan

Migration: ${plan.migration}

## Detected areas
${areas.length ? areas.map((a) => `- ${a}`).join('\n') : '- No manifest areas detected. Provide --manifest for better results.'}

## Phases
${plan.phases.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Risks
${plan.risks.map((r) => `- ${r}`).join('\n')}
`);
