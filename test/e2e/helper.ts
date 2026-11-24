import { cp, mkdir, mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import {
  createRsbuild,
  loadConfig,
  mergeRsbuildConfig,
  type RsbuildConfig,
} from '@rsbuild/core';
import {
  getDistFiles,
  proxyConsole,
  type ExtendedLogHelper,
} from '@rstackjs/test-utils';
import { test as base } from '@rstest/playwright';

export { expect } from '@rstest/playwright';

type Mode = 'dev' | 'build' | 'preview';
type Run = (
  mode: Mode,
  options?: { fixture?: string; config?: RsbuildConfig },
) => Promise<{
  url: string;
  getDistFiles: (sourceMaps?: boolean) => Promise<Record<string, string>>;
}>;

export const test = base.extend<{
  cwd: string;
  logs: ExtendedLogHelper;
  run: Run;
}>({
  cwd: async ({ task }, use) => {
    const parent = path.join(import.meta.dirname, '../../test-results');
    await mkdir(parent, { recursive: true });
    const cwd = await mkdtemp(path.join(parent, 'solid-'));
    try {
      if (!task.filepath) throw new Error('Missing test file path');
      await cp(path.dirname(task.filepath), cwd, {
        recursive: true,
        filter: (file) => !file.endsWith('.test.ts'),
      });
      await use(cwd);
    } finally {
      await rm(cwd, { recursive: true, force: true, maxRetries: 3 });
    }
  },

  logs: [
    async ({ task }, use) => {
      const logs = proxyConsole();
      try {
        await use(logs);
        logs.expectNoLog(/\bBuild warnings?:/);
      } finally {
        logs.restore();
        if (task.result?.status === 'fail') logs.printCapturedLogs();
      }
    },
    { auto: true },
  ],

  run: async ({ cwd }, use) => {
    const closes: (() => Promise<void>)[] = [];
    const previousEnv = process.env.NODE_ENV;
    try {
      await use(async (mode, options = {}) => {
        process.env.NODE_ENV = mode === 'dev' ? 'development' : 'production';
        const root = path.resolve(cwd, options.fixture ?? '.');
        const { content } = await loadConfig({ cwd: root });
        const rsbuild = await createRsbuild({
          cwd: root,
          config: mergeRsbuildConfig(
            {
              server: { port: 0 },
              dev: { writeToDisk: true },
              performance: { buildCache: false },
            },
            content,
            options.config ?? {},
          ),
        });

        let url = '';
        if (mode === 'dev') {
          const compiled = new Promise<void>((resolve) => {
            rsbuild.onAfterDevCompile(() => resolve());
          });
          const result = await rsbuild.startDevServer();
          closes.push(() => result.server.close());
          await compiled;
          [url] = result.urls;
        } else {
          const build = await rsbuild.build();
          closes.push(() => build.close());
          if (mode === 'preview') {
            const result = await rsbuild.preview();
            closes.push(() => result.server.close());
            [url] = result.urls;
          }
        }
        return {
          url,
          getDistFiles: (sourceMaps) =>
            getDistFiles(rsbuild.context.distPath, sourceMaps),
        };
      });
    } finally {
      for (const close of closes.reverse()) await close();
      if (previousEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousEnv;
    }
  },
});
