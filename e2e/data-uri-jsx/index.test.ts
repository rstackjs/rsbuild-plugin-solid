import { pluginSolid } from '@rsbuild/plugin-solid';
import { getFileContent } from '@rstackjs/test-utils';
import { expect, test } from '../helper.ts';

for (const compiler of ['native', 'babel'] as const) {
  test(`should compile Solid JSX in a data URI with ${compiler}`, async ({
    run,
    page,
  }) => {
    const rsbuild = await run('preview', {
      config: {
        plugins: [pluginSolid({ compiler })],
      },
    });

    await page.goto(rsbuild.url);
    await expect(page.locator('#data-uri')).toHaveText('data uri');
  });

  test(`should preserve the data URI source map with ${compiler}`, async ({
    run,
  }) => {
    const rsbuild = await run('build', {
      config: {
        output: {
          sourceMap: {
            js: 'source-map',
          },
        },
        plugins: [pluginSolid({ compiler })],
      },
    });
    const sourceMap = JSON.parse(
      getFileContent(await rsbuild.getDistFiles(true), 'index.js.map'),
    ) as { sources: string[] };

    expect(
      sourceMap.sources.some((source) =>
        source.includes('data:text/javascript'),
      ),
    ).toBe(true);
  });
}
