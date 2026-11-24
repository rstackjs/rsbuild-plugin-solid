import type { RsbuildConfig } from '@rsbuild/core';
import { pluginSolid } from '@rsbuild/plugin-solid';
import { getFileContent } from '@rstackjs/test-utils';
import { expect, test } from '../helper.ts';

const commonConfig = {
  output: {
    minify: false,
  },
  splitChunks: {
    preset: 'none',
    cacheGroups: {
      'solid-runtime': {
        test: /node_modules[\\/]@solidjs[\\/]web[\\/]/,
        name: 'solid-runtime',
        chunks: 'all',
        enforce: true,
      },
    },
  },
} satisfies RsbuildConfig;

for (const compiler of ['native', 'babel'] as const) {
  test(`should emit hydration walk helpers with ${compiler} when dev is true`, async ({
    run,
  }) => {
    const rsbuild = await run('build', {
      config: {
        ...commonConfig,
        plugins: [
          pluginSolid({
            compiler,
            dev: true,
            refresh: { disabled: true },
            ssr: true,
          }),
        ],
      },
    });
    const content = getFileContent(await rsbuild.getDistFiles(), 'index.js');

    expect(content).toContain('getFirstChild');
    expect(content).toContain('getNextSibling');
  });

  test(`should omit hydration walk helpers with ${compiler} when dev is false`, async ({
    run,
  }) => {
    const rsbuild = await run('dev', {
      config: {
        ...commonConfig,
        plugins: [
          pluginSolid({
            compiler,
            dev: false,
            refresh: { disabled: true },
            ssr: true,
          }),
        ],
      },
    });
    const content = getFileContent(await rsbuild.getDistFiles(), 'index.js');

    expect(content).toContain('.firstChild');
    expect(content).toContain('.nextSibling');
    expect(content).not.toContain('getFirstChild');
    expect(content).not.toContain('getNextSibling');
  });
}
