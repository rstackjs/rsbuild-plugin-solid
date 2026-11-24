import { expect, test } from '../helper.ts';

test('should build solid component with decorators', async ({ page, run }) => {
  await page.goto((await run('preview')).url);

  await expect(page.locator('#decorator')).toHaveText('decorator works');
});
