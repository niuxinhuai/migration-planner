# migration-planner

[![CI](https://github.com/niuxinhuai/migration-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/niuxinhuai/migration-planner/actions/workflows/ci.yml)

Generate a practical migration plan from dependency manifests and requested version changes.

根据依赖清单和目标版本，生成实用的升级迁移计划。

## English

### Install

```bash
npm install -g migration-planner
```

For local development:

```bash
npm install
npm link
migration-planner --help
```

### Features

- Reads package.json and detects package manager from lockfiles.
- Identifies frontend, backend, testing, build, TypeScript, and database migration areas.
- Outputs phases, verification commands, risks, and rollback notes.
- Supports JSON output for automation.

### Usage

```bash
migration-planner --from "React 18" --to "React 19"
migration-planner --manifest examples/package.json
migration-planner --json
```

### Automation

Use this as a planning tool before starting a migration branch.

### Test

```bash
npm test
npm --cache /tmp/npm-cache pack --dry-run .
```

## 中文

### 安装

```bash
npm install -g migration-planner
```

本地开发：

```bash
npm install
npm link
migration-planner --help
```

### 功能

- 读取 package.json，并根据 lockfile 判断包管理器。
- 识别前端、后端、测试、构建、TypeScript 和数据库迁移影响面。
- 输出迁移阶段、验证命令、风险和回滚说明。
- 支持 JSON 输出，便于自动化。

### 用法

```bash
migration-planner --from "React 18" --to "React 19"
migration-planner --manifest examples/package.json
migration-planner --json
```

### 自动化

Use this as a planning tool before starting a migration branch.

### 测试

```bash
npm test
npm --cache /tmp/npm-cache pack --dry-run .
```
