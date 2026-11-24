import { pluginSolid } from '@rsbuild/plugin-solid';
import { expect, test } from '../helper.ts';

for (const compiler of ['native', 'babel'] as const) {
  for (const mode of ['dev', 'preview'] as const) {
    const options = {
      config: {
        plugins: [pluginSolid({ compiler, ssr: true })],
      },
    };

    test(`should server-render HTML with ${compiler} in ${mode}`, async ({
      run,
    }) => {
      const result = await run(mode, options);
      const response = await fetch(result.url);
      const html = (await response.text()).replace(/<!--.*?-->/gs, '');

      expect(response.status).toBe(200);
      expect(html).toMatch(/<button[^>]*id="button"[^>]*>count: 0<\/button>/);
    });

    test(`should hydrate existing DOM with ${compiler} in ${mode}`, async ({
      page,
      run,
    }) => {
      const result = await run(mode, options);
      await page.goto(result.url);

      const serverButton = await page.evaluateHandle('window.ssrButton');
      const button = page.locator('#button');
      await button.click();
      await expect(button).toHaveText('count: 1');
      expect(
        await button.evaluate(
          (node, original) => node === original,
          serverButton,
        ),
      ).toBe(true);
    });
  }
}
