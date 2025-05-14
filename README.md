# Angular Schematic Builder
A custom Angular builder for compiling and bundling Angular schematics.

## Overview
This project provides a builder for Angular schematics that:
- Compiles TypeScript files using a specified tsconfig
- Cleans the output directory
- Copies specified project files to the output directory
- Prepares a clean package.json for distribution

## Getting started

### Create an empty schematics project _(skip if you have one)_

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
            "files": ["src/**", "package.json", "README.md"],
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

### Build

Run command:
```bash
ng build 
```

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

## Requirements
- Node.js
- Angular CLI
- TypeScript

## License
MIT

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.


