import fs from 'node:fs';
import path from 'node:path';
import { editFile } from '@rstackjs/test-utils';
import { expect, test } from '../helper.ts';

test('HMR should work properly', async ({ page, run, cwd }) => {
  const compFilePath = path.join(cwd, 'src/test-temp-B.jsx');
  const compSourceCode = `const B = (props) => {
  return <div id="B">B: {props.count()}</div>;
};

export default B;
`;

  fs.writeFileSync(compFilePath, compSourceCode, 'utf-8');

  await page.goto((await run('dev')).url);

  const a = page.locator('#A');
  const b = page.locator('#B');

  await expect(a).toHaveText('A: 0');
  await expect(b).toHaveText('B: 0');

  await a.click({ clickCount: 5 });
  await expect(a).toHaveText('A: 5');
  await expect(b).toHaveText('B: 5');

  // simulate a change to component B's source code
  await editFile(compFilePath, (code) => code.replace('B:', 'Beep:'));

  await page.waitForFunction(() => {
    const aText = document.querySelector('#A')?.textContent;
    const bText = document.querySelector('#B')?.textContent;

    return (
      // the state (count) of A should be kept
      aText === 'A: 5' &&
      // content of B changed to `Beep: 5` means HMR has taken effect
      bText === 'Beep: 5'
    );
  });
});

test('HMR should recover after fixing a syntax error', async ({
  page,
  run,
  cwd,
  logs,
}) => {
  const compFilePath = path.join(cwd, 'src/test-temp-B.jsx');
  const compSourceCode = `const B = () => <div id="B">Before</div>;

export default B;
`;

  fs.writeFileSync(compFilePath, compSourceCode, 'utf-8');

  await page.goto((await run('dev')).url);
  const b = page.locator('#B');

  await expect(b).toHaveText('Before');

  await editFile(compFilePath, (code) => code.replace('</div>', '</div'));
  await logs.expectLog('Module build failed');

  await editFile(compFilePath, (code) =>
    code.replace('Before</div', 'Recovered</div>'),
  );
  await expect(b).toHaveText('Recovered');
});
