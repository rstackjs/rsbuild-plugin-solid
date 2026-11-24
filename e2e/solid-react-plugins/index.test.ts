import { expect, test } from '../helper.ts';

test('should build React and Solid plugins in different environments', async ({
  page,
  run,
}) => {
  const rsbuild = await run('preview');

  const reactUrl = new URL('/react', rsbuild.url);

  await page.goto(reactUrl.href);

  await expect(page.locator('#test')).toHaveText('Hello Rsbuild!');

  const solidUrl = new URL('/solid', rsbuild.url);

  await page.goto(solidUrl.href);

  const button = page.locator('#button');
  await expect(button).toHaveText('count: 0');

  await button.click();
  await expect(button).toHaveText('count: 1');
});
