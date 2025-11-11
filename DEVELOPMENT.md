# Development Guide

This guide provides essential information for developers contributing to the ngx-schematic-builder project. It covers
setup, building, testing, releasing, code standards, and contribution guidelines to help you get started and maintain
consistency.

## Development Setup

1. Clone the repository: `git clone https://github.com/kstepien3/ngx-schematic-builder.git`
2. Install dependencies: `npm install`
3. Ensure Node.js v14+

## Building

- Development build: `npm run build`
- Watch mode: `npm run build:watch`

## Testing

- Run tests: `npm test`
- Run tests once: `npm run test:once`
- Tests use the Vitest framework

## Creating a Release

This project uses git tags and GitHub releases with automatically generated descriptions.

### Run the below prompt to set a new version:

#### Windows

```shell
read -p "Provide new version (example: 1.2.3): " NEW_VERSION
```

#### Unix system

```shell
vared -p "Provide new version (example: 1.2.3): " -c NEW_VERSION
```

### Create a new release via this script:

```shell
git switch main && git pull origin main
npm pkg set version=$NEW_VERSION
git add package.json && git commit -m "Bump version to $NEW_VERSION"
git tag "v$NEW_VERSION"
git push origin main --tags
```

### Publish

To publish the package run the CLI `npm publish`.
The `build` command is not required while `prepack` script will do it automatically.

After pushing the tag, create a GitHub release:

1. [Create a new release](https://github.com/kstepien3/ngx-schematic-builder/releases/new) from the tag
2. GitHub will auto-generate release notes based on commits since the last tag

## Code Style and Conventions

- TypeScript strict mode enabled
- Formatting: Prettier (2 spaces, single quotes, semicolons, 120 width)
- Imports: Angular DevKit → third-party → Node.js → local
- Naming: camelCase for functions/variables, PascalCase for types
- Error handling: Use `tryCatch` utility with Result unions
- Prefer async/await over Promises

## Contributing

- Follow the contributing guidelines in README.md
- Ensure code passes TypeScript compilation
- Add tests for new features
- Update documentation as needed
