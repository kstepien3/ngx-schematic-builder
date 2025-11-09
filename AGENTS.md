# Agent Guidelines for ngx-schematic-builder

## Project Context

- **Purpose**: Angular schematic builder for compiling and bundling Angular schematics
- **Usage**: Run with `ng build` (Angular CLI), not just `npm run build`
- **Output**: Clean distribution package with compiled JS, .d.ts files, and optimized package.json

## Commands

- **Build**: `npm run build` (TypeScript compilation) or `ng build` (Angular CLI)
- **Watch build**: `npm run build:watch`
- **Prepack**: `npm run prepack` (auto-runs build before publishing)
- **Lint**: No dedicated lint command (relies on TypeScript strict mode)
- **Test**: No test runner configured (empty spec file)

## Configuration Requirements

- **angular.json**: Must configure builder `"ngx-schematic-builder:build"` with `tsConfig` and optional `files` array
- **package.json**: Set `"schematics": "./collection.json"` (remove `src/` prefix after build)
- **tsconfig.json**: Must include `"outDir": "dist"` for proper output directory

## Build Process

1. Validate project configuration
2. Get output directory from tsconfig
3. Clean output directory
4. Compile TypeScript files
5. Copy specified project files
6. Clean package.json (remove scripts/devDependencies)
7. Validate build output

## Code Style

- **TypeScript**: Strict mode enabled (noImplicitAny, strictNullChecks, noUnusedLocals/Parameters)
- **Formatting**: Prettier (2 spaces, single quotes, semicolons, 120 width, ES5 trailing commas)
- **Imports**: Angular DevKit → third-party → Node.js built-ins → local imports
- **Naming**: camelCase functions/variables, PascalCase types/interfaces
- **Error handling**: Use `tryCatch` utility with discriminated Result unions
- **Async**: Prefer async/await over Promises
- **Types**: Use const assertions (`as const`), JSDoc for complex types
- **Assertions**: Use `as` for type assertions when necessary

## Code Patterns

- **Logger**: Nested const object with `info`/`error` sub-objects using `as const`
- **Functions**: Main builder function with helper functions for each build step
- **Validation**: Separate validation functions returning error string or null
- **Error handling**: Consistent `handleError` function with context logging
- **Interfaces**: Extend `JsonObject` for Angular builder options
