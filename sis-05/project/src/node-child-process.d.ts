// The one Node API the R1 test uses. @types/node is not a dependency of this project, and adding it
// would be a dependency change (AGENTS.md: never without review), so the signature is declared here.
declare module 'node:child_process' {
  export function spawnSync(
    command: string,
    args: string[],
    options: { cwd: string; encoding: 'utf8' },
  ): { status: number | null; stdout: string; stderr: string };
}
