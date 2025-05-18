# Angular Schematic Builder

A custom Angular builder for compiling and bundling Angular schematics.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Creating a New Schematics Project](#create-an-empty-schematics-project)
    - [Installation](#installation-dependencies)
- [Usage](#usage)
    - [Options](#options)
    - [Building](#build)
- [Examples](#see-usage-in-the-package)
- [Features](#features)
- [Build Process](#build-process)
- [Output Structure](#output-structure)
- [Requirements](#requirements)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contributing](#contributing)

## Overview
This project provides a builder for Angular schematics that:
- Compiles TypeScript files using a specified tsconfig
- Cleans the output directory
- Copies specified project files to the output directory
- Prepares a clean package.json for distribution

## Getting Started

### Create an empty schematics project

_(skip if you have one)_

**Install cli globally**

```bash
npm install -g @angular-devkit/schematics-cli
```

**Create a new project**
```bash
schematics blank --name=new-project
```

### Installation dependencies
``` bash
npm i -D @angular/cli ngx-schematic-builder
```

### Usage
Create or edit _(if you have)_ `angular.json` file and put `build` prop in `projects.*project name*.architect`.

You can copy the configuration from below.

``` json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "projects": {
    "schematic": {
      "projectType": "library",
      "root": "",
      "sourceRoot": "src",
      "architect": {
        "build": {
          "builder": "ngx-schematic-builder:build",
          "options": {
            "files": ["src/**", "LICENSE.md", "README.md"],
            "tsConfig": "tsconfig.json"
          }
        }
      }
    }
  }
}
```

### Options

| Option | Type      | Description | Required |
| --- |-----------| --- | --- |
| `tsConfig` | `string`  | Path to the TypeScript configuration file | Yes |
| `files` | `string[]` | Array of files to copy to the output directory | No |


### TS Config update
```json
{
  "compilerOptions": {
    "baseUrl": "tsconfig",
    "target": "es6",
    "declaration": true,
    "module": "commonjs",
    "moduleResolution": "node",
    "noEmitOnError": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedParameters": true,
    "noUnusedLocals": true,
    "skipDefaultLibCheck": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strictNullChecks": true,
    "types": ["node"],
    "outDir": "dist" // Add this
  }
}

```
### Build

Run command:
```bash
ng build 
```

## Output Structure

After running the build command, your output directory (as specified in your tsconfig) will contain:
- Compiled JavaScript files from your TypeScript source
- Declaration files (.d.ts)
- A cleaned package.json (without scripts and devDependencies)
- Any additional files specified in the `files` option

## See usage in the package:

**@ng-zen/cli**
- NPM Package: [https://www.npmjs.com/package/@ng-zen/cli](https://www.npmjs.com/package/@ng-zen/cli)
- Example implementation: [https://github.com/kstepien3/ng-zen/blob/master/angular.json](https://github.com/kstepien3/ng-zen/blob/master/angular.json)

## Features
- **TypeScript Compilation**: Compiles your TypeScript files according to the specified tsconfig
- **Output Cleaning**: Ensures a clean output directory before building
- **File Copying**: Copies specified project files to the output directory
- **Package.json Optimization**: Removes development-related configurations (scripts, devDependencies) from the output package.json

## Build Process
The builder executes the following steps:
1. Determines the output directory from the tsconfig
2. Cleans the output directory
3. Compiles TypeScript files
4. Copies specified project files to the output directory
5. Optimizes package.json by removing scripts and devDependencies

## Troubleshooting

### Common Issues

**Issue**: Error: Unable to locate or read the "schematic" file specified in package.json.
You might need to remove `src` path
**Solution**: If your tsconfig file has `"rootDir": "src"` & `"outDir": "dist"`, make you sure your _package.json_ file should looks like this:
```json+diff
{
  // ...
- "schematics": "./src/collection.json",
+ "schematics": "./collection.json",
  // ...        
}
```

## Requirements
- Node.js (v14.0.0 or later)
- Angular CLI (v12.0.0 or later)
- TypeScript (v4.0.0 or later)

## License
MIT

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

