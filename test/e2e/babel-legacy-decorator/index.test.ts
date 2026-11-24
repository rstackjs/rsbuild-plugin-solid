import { expect, test } from '../helper.ts';

test('should support legacy TypeScript decorators with Babel compiler', async ({
  page,
  run,
}) => {
  await page.goto((await run('preview')).url);

  await expect(page.locator('#decorator')).toHaveText(
    'legacy decorator works: 0',
  );
});
