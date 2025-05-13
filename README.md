# Angular Schematic Builder
A custom Angular builder for compiling and bundling Angular schematics.
## Overview
This project provides a builder for Angular schematics that:
- Compiles TypeScript files using a specified tsconfig
- Cleans the output directory
- Copies specified project files to the output directory
- Prepares a clean package.json for distribution

## Installation
``` bash
npm install -D ngx-schematic-builder
```

## Usage
Add the builder to your file: `angular.json`
``` json
{
  "projects": {
    "your-project": {
      "architect": {
        "build": {
          "builder": "ngx-schematic-builder:build",
          "options": {
            "files": ["src/**", "README.md", "LICENSE", "CHANGELOG.md"],
            "tsConfig": "tsconfig.schematics.json"
          }
        }
      }
    }
  }
}
```
### Options

| Option | Description | Required |
| --- | --- | --- |
| `tsConfig` | Path to the TypeScript configuration file | Yes |
| `files` | Array of files to copy to the output directory | No |

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
MIT (or specify your license)
## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
