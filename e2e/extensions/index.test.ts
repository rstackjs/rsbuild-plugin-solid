import path from 'node:path';
import { pluginSolid } from '@rsbuild/plugin-solid';
import { editFile, getFileContent } from '@rstackjs/test-utils';
import { expect, test } from '../helper.ts';

const extensions = ['.mjsx', '.cjsx', '.mtsx', '.ctsx', '.solid'];

for (const compiler of ['native', 'babel'] as const) {
  const config = {
    plugins: [pluginSolid({ compiler, extensions: ['.solid'] })],
  };

  test(`should build additional Solid extensions with ${compiler}`, async ({
    run,
    page,
  }) => {
    const rsbuild = await run('preview', {
      config: {
        ...config,
        output: {
          sourceMap: { js: 'source-map' },
        },
      },
    });
    await page.goto(rsbuild.url);

    for (const ext of extensions) {
      await expect(page.locator(`#${ext.slice(1)}`)).toHaveText(ext.slice(1));
    }
    await expect(page.locator('#raw')).toContainText('<p id="solid">');

    const sourceMap = JSON.parse(
      getFileContent(await rsbuild.getDistFiles(true), 'index.js.map'),
    ) as { sources: string[] };
    for (const ext of extensions) {
      expect(
        sourceMap.sources.some((source) =>
          source.endsWith(`/${ext.slice(1)}${ext}`),
        ),
      ).toBe(true);
    }
  });

  test(`should preserve state when updating Solid extensions with ${compiler}`, async ({
    run,
    page,
    cwd,
  }) => {
    const src = path.join(cwd, 'src');
    await page.goto((await run('dev', { config })).url);
    const count = page.locator('#count');
    await count.click();
    await expect(count).toHaveText('1');

    for (const ext of extensions) {
      const name = ext.slice(1);
      await editFile(path.join(src, `${name}${ext}`), (code) =>
        code.replace(`'${name}'`, `'${name} updated'`),
      );
      await expect(page.locator(`#${name}`)).toHaveText(`${name} updated`);
      await expect(count).toHaveText('1');
    }
  });
}
