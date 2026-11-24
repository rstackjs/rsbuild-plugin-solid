import { pluginSolid } from '@rsbuild/plugin-solid';
import { expect, test } from './helper.ts';

test('should build basic solid component properly', async ({ page, run }) => {
  const rsbuild = await run('preview', {
    fixture: 'basic',
    config: { plugins: [pluginSolid()] },
  });

  await page.goto(rsbuild.url);

  const button = page.locator('#button');
  await expect(button).toHaveText('count: 0');

  await button.click();
  await expect(button).toHaveText('count: 1');
});

test('should build solid component with typescript', async ({ page, run }) => {
  const rsbuild = await run('preview', {
    fixture: 'ts',
    config: { plugins: [pluginSolid()] },
  });

  await page.goto(rsbuild.url);

  const button = page.locator('#button');
  await expect(button).toHaveText('count: 0');

  await button.click();
  await expect(button).toHaveText('count: 1');
});

// test cases for CSS preprocessors
for (const name of ['less', 'scss']) {
  test(`should build solid component with ${name}`, async ({ page, run }) => {
    const rsbuild = await run('preview', {
      fixture: name,
      config: { plugins: [pluginSolid()] },
    });

    await page.goto(rsbuild.url);

    const title = page.locator('#title');

    await expect(title).toHaveText('Hello World!');
    // use the text color to assert the compilation result
    await expect(title).toHaveCSS('color', 'rgb(255, 62, 0)');
  });
}
