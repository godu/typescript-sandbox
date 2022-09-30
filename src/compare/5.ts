import * as R from "fp-ts/lib/ReaderTask";
import F from "fp-ts/lib/function";
import { ask } from "../util";
import * as url from "node:url";

export const isEqual = <T>(first: T, second: T): boolean =>
  first === second;

export const getMessage = (isEqual: boolean): string =>
  isEqual
    ? "The two strings are equal"
    : "The two strings aren't equal";

export type Ask = (question: string) => Promise<string>;
export const run1: R.ReaderTask<
  {
    ask: Ask;
  },
  string[]
> = R.asksReaderTask(({ ask }: { ask: Ask }) =>
  R.fromTask(async () => {
    const first = await ask("First ?");
    const second = await ask("Second ?");
    return [first, second];
  })
);

export type Log = (message: string) => void;
export const run2: (result: boolean) => R.ReaderTask<
  {
    log: Log;
  },
  void
> = (result: boolean) =>
  R.asks(({ log }: { log: Log }) => {
    const message = getMessage(result);
    return log(message);
  });

export const run = F.pipe(
  run1,
  R.chainW(([first, second]) => {
    const result = isEqual(first, second);
    return R.apFirst(run2(result))(R.of(result));
  })
);

export const main = () => run({ ask, log: console.log })();

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
