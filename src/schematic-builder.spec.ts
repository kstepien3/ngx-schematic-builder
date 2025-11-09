import { describe, it, expect, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'node:path';
import { BuilderContext } from '@angular-devkit/architect';

// Import internal functions for testing
import { Options, validateProject, handleError, getOutputDir, cleanOutputDir } from './schematic-builder';

describe('validateProject', () => {
  it('should return error if tsConfig is undefined', () => {
    const options = { files: [] } as unknown as Options;
    const error = validateProject(options);
    expect(error).toContain('tsConfig is required');
  });

  it('should return null if tsConfig is provided', () => {
    const options = { tsConfig: 'tsconfig.json', files: [] };
    const error = validateProject(options);
    expect(error).toBeNull();
  });
});

describe('handleError', () => {
  it('should log error and return failure output', () => {
    const context = {
      logger: {
        error: vi.fn(),
      },
    } as unknown as BuilderContext;
    const logMessage = 'Test error';
    const errorMessage = 'Detailed error';

    const result = handleError(context, logMessage, errorMessage);

    expect(context.logger.error).toHaveBeenCalledWith(logMessage);
    expect(result).toEqual({ success: false, error: errorMessage });
  });
});

describe('getOutputDir', () => {
  it('should return null if no outDir in tsconfig', async () => {
    const tsConfigPath = '/fake/tsconfig.json';
    const workspaceRoot = '/fake';

    // Mock fs.readFileSync
    const mockReadFileSync = vi.spyOn(fs, 'readFileSync').mockReturnValue(
      JSON.stringify({
        compilerOptions: {},
      })
    );

    const result = await getOutputDir(tsConfigPath, workspaceRoot);

    expect(result).toBeNull();
    mockReadFileSync.mockRestore();
  });

  it('should return resolved outDir path', async () => {
    const tsConfigPath = 'tsconfig.json';
    const workspaceRoot = '/workspace';
    const outDir = 'dist';

    const mockReadFileSync = vi.spyOn(fs, 'readFileSync').mockReturnValue(
      JSON.stringify({
        compilerOptions: { outDir },
      })
    );

    const result = await getOutputDir(tsConfigPath, workspaceRoot);

    expect(result).toBe(path.resolve('/workspace', outDir));
    mockReadFileSync.mockRestore();
  });
});

describe('cleanOutputDir', () => {
  it('should remove and recreate directory', async () => {
    const outputDir = '/fake/dist';

    const mockPathExists = vi.spyOn(fs, 'pathExists').mockResolvedValue(true);
    const mockRm = vi.spyOn(fs, 'rm').mockResolvedValue();
    const mockMkdir = vi.spyOn(fs, 'mkdir').mockResolvedValue();

    await cleanOutputDir(outputDir);

    expect(mockRm).toHaveBeenCalledWith(outputDir, { recursive: true, force: true });
    expect(mockMkdir).toHaveBeenCalledWith(outputDir, { recursive: true });

    mockPathExists.mockRestore();
    mockRm.mockRestore();
    mockMkdir.mockRestore();
  });
});
