import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { JsonObject } from '@angular-devkit/core';

import cpy from 'cpy';
import fs from 'fs-extra';
import path from 'node:path';
import { execa } from 'execa';
import { tryCatch } from './utils/try-catch';

export interface Options extends JsonObject {
  tsConfig: string;
  files: string[];
}

const logger = {
  info: {
    startBuild: 'Starting build process 🚀 ',
    noOutDir: 'No outDir specified in tsconfig. Running TypeScript compilation only.',
    endBuild: 'Build process completed successfully! 🎉 ',
  },
  error: {
    buildValidate:
      'Error: Unable to locate or read the "schematic" file specified in package.json. \nYou might need to remove `src` path',
    tsConfigOption: 'Error: tsConfig is required \nProvide tsconfig path in options in angular.json file!',
    outputDir: 'Error: Failed to get output directory',
    cleanOutputDir: 'Error: Failed to clean output directory',
    compileTypeScript: 'Error: TypeScript compilation failed',
    copyProjectFiles: 'Error: Failed to copy project files',
    cleanPackageJson: 'Error: Failed to update package.json',
  },
} as const;

export default createBuilder(buildSchematic);

async function buildSchematic(options: Options, context: BuilderContext): Promise<BuilderOutput> {
  const error = validateProject(options);
  if (error) {
    return { success: false, error };
  }

  const files = ['package.json', ...options.files];

  context.logger.info(logger.info.startBuild);

  // GET OUTPUT DIR
  const { data: outputDir, error: outputDirErr } = await tryCatch(
    getOutputDir(options.tsConfig, context.workspaceRoot)
  );
  if (outputDirErr) return handleError(context, logger.error.outputDir, outputDirErr.message);

  // If there's no outDir, only run TypeScript compilation
  if (outputDir === null) {
    context.logger.info(logger.info.noOutDir);

    // COMPILE TYPESCRIPT
    const { error: compileTypescriptErr } = await tryCatch(
      compileTypeScript(options.tsConfig, context.currentDirectory)
    );
    if (compileTypescriptErr) return handleError(context, logger.error.compileTypeScript, compileTypescriptErr.message);

    context.logger.info(logger.info.endBuild);
    return { success: true };
  }

  // CLEAN OUTPUT DIR
  const { error: cleanUpDirErr } = await tryCatch(cleanOutputDir(outputDir));
  if (cleanUpDirErr) return handleError(context, logger.error.cleanOutputDir, cleanUpDirErr.message);

  // COMPILE TYPESCRIPT
  const { error: compileTypescriptErr } = await tryCatch(compileTypeScript(options.tsConfig, context.currentDirectory));
  if (compileTypescriptErr) return handleError(context, logger.error.compileTypeScript, compileTypescriptErr.message);

  // COPY PROJECT FILES
  const { error: copyProjectFilesErr } = await tryCatch(copyProjectFiles(files, outputDir, context.currentDirectory));
  if (copyProjectFilesErr) return handleError(context, logger.error.copyProjectFiles, copyProjectFilesErr.message);

  // CLEAN PACKAGE.JSON
  const { error: cleanPackageJsonErr } = await tryCatch(cleanPackageJson(outputDir));
  if (cleanPackageJsonErr) return handleError(context, logger.error.cleanPackageJson, cleanPackageJsonErr.message);

  // Validate output
  const { error: buildValidateErr } = await tryCatch(buildValidate(outputDir));
  if (buildValidateErr) return handleError(context, logger.error.buildValidate, buildValidateErr.message);

  context.logger.info(logger.info.endBuild);
  return { success: true };
}

function validateProject(options: Options): string | null {
  if (options.tsConfig === undefined) return logger.error.tsConfigOption;

  return null;
}

function handleError(context: BuilderContext, logMessage: string, errorMessage: string): BuilderOutput {
  context.logger.error(logMessage);
  return { success: false, error: errorMessage };
}

async function cleanOutputDir(outputDir: string): Promise<void> {
  if (await fs.pathExists(outputDir)) {
    await fs.rm(outputDir, { recursive: true, force: true });
  }
  await fs.mkdir(outputDir, { recursive: true });
}

async function getOutputDir(
  tsConfigPath: Options['tsConfig'],
  workspaceRoot: BuilderContext['workspaceRoot']
): Promise<string | null> {
  const fullPath = path.resolve(workspaceRoot, tsConfigPath);
  const configContent = fs.readFileSync(fullPath, {
    encoding: 'utf-8',
  });

  const outDir = JSON.parse(configContent).compilerOptions?.outDir;

  if (!outDir) return null;

  const tsConfigDir = path.dirname(fullPath);

  return path.resolve(tsConfigDir, outDir);
}

async function compileTypeScript(tsConfig: Options['tsConfig'], currentDirectory: BuilderContext['currentDirectory']) {
  await execa('tsc', ['-p', tsConfig], {
    stdio: 'inherit',
    cwd: currentDirectory,
  });
}

async function copyProjectFiles(
  files: Options['files'],
  outputDir: string,
  currentDirectory: BuilderContext['currentDirectory']
): Promise<void> {
  await cpy(files, outputDir, {
    cwd: currentDirectory,
  });
}

async function cleanPackageJson(outputDir: string): Promise<void> {
  const distPackageJson = path.join(outputDir, 'package.json');
  let pkg = await fs.readJson(distPackageJson);
  delete pkg['scripts'];
  delete pkg['devDependencies'];
  await fs.writeJson(distPackageJson, pkg, { spaces: 2 });
}

async function buildValidate(outputDir: string): Promise<void> {
  const distPackageJson = path.join(outputDir, 'package.json');
  const pkg = await fs.readJson(distPackageJson);
  await fs.readFile(path.join(outputDir, pkg['schematics']));
}

export { validateProject, handleError, getOutputDir, cleanOutputDir };
