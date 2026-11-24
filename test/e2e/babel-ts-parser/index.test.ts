import { expect, test } from '../helper.ts';

test('should parse TypeScript without treating it as JSX', async ({
  page,
  run,
}) => {
  await page.goto((await run('preview')).url);

  const button = page.locator('#button');
  await expect(button).toHaveText('count: 0');

  await button.click();
  await expect(button).toHaveText('count: 1');
});
