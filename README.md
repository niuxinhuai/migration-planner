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

### Usage

Run in a project, optionally naming the migration.

```bash
migration-planner --from "React 18" --to "React 19"
migration-planner --manifest package.json --json
```

### Status

This is an MVP designed to be useful immediately and easy to extend. It has no runtime dependencies and targets Node.js 18+.

### Test

```bash
npm test
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

### 用法

在项目目录运行，也可以指定迁移目标。

```bash
migration-planner --from "React 18" --to "React 19"
migration-planner --manifest package.json --json
```

### 当前状态

这是一个可以直接使用的 MVP，重点是小、清晰、容易二次开发。运行时无第三方依赖，要求 Node.js 18+。

### 测试

```bash
npm test
```
