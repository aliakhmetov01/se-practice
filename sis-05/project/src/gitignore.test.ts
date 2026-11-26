import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

// R1: generated folders and secret files must be ignored by git in this project, so that an agent's
// `git add .` cannot commit them. Asks git itself (`git check-ignore`), run from the project folder.
describe('R1 - generated and secret files stay out of git', () => {
  it.each(['node_modules/', 'dist/', '.env', '.env.local'])('R1 git ignores %s', path => {
    const result = spawnSync('git', ['check-ignore', '--no-index', '-q', path], { cwd: '.', encoding: 'utf8' });
    expect(result.status, `git check-ignore ${path}`).toBe(0);
  });

  it('R1 git does not ignore the source, the lockfile or .env.example', () => {
    for (const path of ['src/booking.ts', 'package-lock.json', '.env.example']) {
      const result = spawnSync('git', ['check-ignore', '--no-index', '-q', path], { cwd: '.', encoding: 'utf8' });
      expect(result.status, `git check-ignore ${path}`).toBe(1);
    }
  });
});
