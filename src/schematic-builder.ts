
import {BuilderContext, BuilderOutput, createBuilder} from '@angular-devkit/architect';
import {JsonObject} from "@angular-devkit/core";

import cpy from 'cpy';
import fs from 'fs-extra';
import path from 'node:path';
import { execa } from 'execa';
import {tryCatch} from "./utils/try-catch";

interface Options extends JsonObject {
    tsConfig: string;
    files: string[]
}

export default createBuilder(buildSchematic)

async function buildSchematic(options: Options, context: BuilderContext): Promise<BuilderOutput> {

    if(options.tsConfig === undefined) {
        return {success: false, error: 'tsConfig is required \nProvide tsconfig path in options in angular.json file!'}
    }

    // GET OUTPUT DIR
    context.logger.info(`[GENERAL] ℹ️ Getting output directory from "${options.tsConfig}"...`)
    const {
        data: outputDir,
        error: outputDirErr
    } = await tryCatch(getOutputDir(options.tsConfig, context.workspaceRoot))
    if (outputDirErr) {
        context.logger.error(`[GENERAL] ❌ Failed to get output directory`)
        return {success: false, error: outputDirErr.message}
    }
    context.logger.info(`[GENERAL] ✔ Output directory determined as: ${outputDir}`)

    // CLEAN OUTPUT DIR
    context.logger.info(`[CLEANING] ⏳ Cleaning output directory "${outputDir}"...`)
    const {error: cleanUpDirErr} = await tryCatch(cleanOutputDir(outputDir))
    if (cleanUpDirErr) {
        context.logger.error(`[CLEANING] ❌ Failed to clean output directory`)
        return {success: false, error: cleanUpDirErr.message}
    }
    context.logger.info(`[CLEANING] ✔ Directory ${outputDir} cleaned successfully.`)

    // COMPILE TYPESCRIPT
    context.logger.info(`[COMPILING] ⏳ Compiling TypeScript (${options.tsConfig})...`)
    const {error: compileTypescriptErr} = await tryCatch(compileTypeScript(options.tsConfig, context.currentDirectory))
    if (compileTypescriptErr) {
        context.logger.error(`[COMPILING] ❌ TypeScript compilation failed`)
        return {success: false, error: compileTypescriptErr.message}
    }
    context.logger.info(`[COMPILING] ✔ TypeScript compilation (${options.tsConfig}) - completed successfully.`)

    // COPY PROJECT FILES
    context.logger.info(`[COPYING] ⏳ Copying project files to ${outputDir}...`)
    const {error: copyProjectFilesErr} = await tryCatch(copyProjectFiles(options.files, outputDir, context.currentDirectory));
    if (copyProjectFilesErr) {
        context.logger.error(`[COPYING] ❌ Failed to copy project files`)
        return {success: false, error: copyProjectFilesErr.message}
    }
    context.logger.info(`[COPYING] ✔ Project files copied to ${outputDir} successfully.`)

    // CLEAN PACKAGE.JSON
    context.logger.info(`[UPDATING] ⏳ Updating package.json in ${outputDir}...`)
    const {error: cleanPackageJsonErr} = await tryCatch(cleanPackageJson(outputDir));
    if (cleanPackageJsonErr) {
        context.logger.error(`[UPDATING] ❌ Failed to update package.json`)
        return {success: false, error: cleanPackageJsonErr.message}
    }
    context.logger.info(`[UPDATING] ✔ package.json in ${outputDir} updated successfully.`)

    context.logger.info(`[BUILD] ✅ Build process completed successfully!`)
    return {success: true}

}

async function cleanOutputDir(outputDir: string): Promise<void> {
    if (await fs.pathExists(outputDir)) {
        await fs.rm(outputDir, { recursive: true, force: true });
    }
    await fs.mkdir(outputDir, { recursive: true });
}

async function getOutputDir(tsConfigPath: Options["tsConfig"], workspaceRoot:BuilderContext['workspaceRoot']): Promise<string> {
    const fullPath = path.resolve(workspaceRoot, tsConfigPath);
    const configContent = fs.readFileSync(fullPath, {
        encoding: "utf-8",
    });

    const config = JSON.parse(configContent);
    const outDir = config.compilerOptions?.outDir ?? 'dist';
    const tsConfigDir = path.dirname(fullPath);

    return path.resolve(tsConfigDir, outDir);
}

async function compileTypeScript(tsConfig: Options["tsConfig"], currentDirectory: BuilderContext['currentDirectory']) {
    await execa('tsc', ['-p', tsConfig], {
        stdio: 'inherit',
        cwd: currentDirectory,
    });
}

async function copyProjectFiles(files: Options['files'], outputDir: string, currentDirectory: BuilderContext['currentDirectory']): Promise<void> {
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
