import { expect, test } from '../helper.ts';

for (const mode of ['dev', 'build'] as const) {
  test(`should preserve native imports for Solid hydration assets without warnings in ${mode}`, async ({
    run,
    logs,
  }) => {
    const result = await run(mode);
    logs.expectNoLog('Critical dependency');
    const content = Object.values(await result.getDistFiles()).join('\n');
    expect(content).toContain('import(entryUrl)');
  });
}
