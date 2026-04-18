import init, { compileToJs } from "playground-wasm/web";

type RunResult = { lines: string[] } | { error: string };

let initialized: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (!initialized) {
    initialized = init().then(() => undefined);
  }
  return initialized;
}

self.onmessage = async (event: MessageEvent<string>) => {
  const source = event.data;
  let result: RunResult;

  try {
    await ensureInit();
    const js = compileToJs(source);

    const captured: string[] = [];
    const shimmedConsole = {
      log: (...args: unknown[]) => {
        captured.push(args.map((a) => String(a)).join(" "));
      },
    };

    // Compiled JS from our own compiler over user-editable source in a
    // Worker sandbox, no DOM access, no main-thread privileges leak here.
    // biome-ignore lint/security/noGlobalEval: Intentional, Worker is the sandbox boundary for the playground.
    new Function("console", js)(shimmedConsole);

    result = { lines: captured };
  } catch (err) {
    result = {
      error: err instanceof Error ? err.message : String(err),
    };
  }

  self.postMessage(result);
};
