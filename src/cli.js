#!/usr/bin/env node
import fs from 'node:fs';
const VERSION = '0.1.0';
const args = process.argv.slice(2);
function has(flag) { return args.includes(flag); }
function val(flag, fallback = '') { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : fallback; }
if (has('--help') || has('-h')) {
  console.log(`migration-planner v${VERSION}

Usage:
  migration-planner [--from text] [--to text] [--manifest package.json] [--json]`);
  process.exit(0);
}
if (has('--version')) { console.log(VERSION); process.exit(0); }
const json = has('--json');
const manifest = val('--manifest', fs.existsSync('package.json') ? 'package.json' : '');
const from = val('--from', 'current stack');
const to = val('--to', 'target stack');
let pkg = {};
if (manifest && fs.existsSync(manifest)) {
  try { pkg = JSON.parse(fs.readFileSync(manifest, 'utf8')); } catch (error) { console.error(`Unable to read manifest: ${error.message}`); process.exit(1); }
}
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
const names = Object.keys(deps);
const packageManager = fs.existsSync('pnpm-lock.yaml') ? 'pnpm' : fs.existsSync('yarn.lock') ? 'yarn' : fs.existsSync('package-lock.json') ? 'npm' : 'unknown';
const areas = [
  names.some((n) => /react|vue|svelte|angular|next/.test(n)) && 'frontend rendering and routing',
  names.some((n) => /express|fastify|koa|nest/.test(n)) && 'backend HTTP APIs',
  names.some((n) => /jest|vitest|mocha|playwright|cypress/.test(n)) && 'test runner and browser tests',
  names.some((n) => /eslint|prettier|typescript|babel|vite|webpack/.test(n)) && 'build, lint, and TypeScript tooling',
  names.some((n) => /prisma|sequelize|typeorm|mongoose/.test(n)) && 'database models and migrations'
].filter(Boolean);
const commands = packageManager === 'pnpm' ? ['pnpm install', 'pnpm test'] : packageManager === 'yarn' ? ['yarn install', 'yarn test'] : packageManager === 'npm' ? ['npm install', 'npm test'] : ['install dependencies with the project package manager', 'run the project test suite'];
const plan = {
  migration: `${from} -> ${to}`,
  packageManager,
  detectedAreas: areas,
  dependencyCount: names.length,
  commands,
  phases: [
    'Create an upgrade branch and capture current test/build status.',
    'Inventory runtime versions, package manager, lockfiles, generated files, and deployment constraints.',
    'Read official migration notes and list breaking changes that apply to detected areas.',
    'Upgrade the smallest compatible set of packages first; avoid unrelated dependency churn.',
    'Fix install, typecheck, lint, and build failures before behavior changes.',
    'Run focused regression tests for detected areas plus one full CI-equivalent pass.',
    'Prepare rollback notes, release checks, and post-release monitoring signals.'
  ],
  risks: [
    'Transitive dependency breaking changes.',
    'Local and CI runtime drift.',
    'Lockfile churn hiding meaningful dependency changes.',
    'Generated code or build output committed accidentally.',
    'Insufficient regression coverage around changed behavior.'
  ],
  rollback: ['Keep the previous lockfile in git history.', 'Tag or record the last known good commit.', 'Document the downgrade command and config reversions.']
};
if (json) { console.log(JSON.stringify(plan, null, 2)); process.exit(0); }
console.log(`# Migration Plan

Migration: ${plan.migration}
Package manager: ${plan.packageManager}
Dependencies seen: ${plan.dependencyCount}

## Detected areas
${areas.length ? areas.map((a) => `- ${a}`).join('\n') : '- No manifest areas detected. Provide --manifest for better results.'}

## Commands to verify
${commands.map((cmd) => `- ${cmd}`).join('\n')}

## Phases
${plan.phases.map((p, i) => `${i + 1}. ${p}`).join('\n')}

## Risks
${plan.risks.map((r) => `- ${r}`).join('\n')}

## Rollback
${plan.rollback.map((r) => `- ${r}`).join('\n')}
`);
