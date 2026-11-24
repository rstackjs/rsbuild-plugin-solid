import { expect, test } from '../helper.ts';

// https://github.com/web-infra-dev/rsbuild/issues/1963
test('Solid ref should work', async ({ page, run }) => {
  await page.goto((await run('dev')).url);

  const test = page.locator('#test');
  await expect(test).toHaveText('abc');
});
