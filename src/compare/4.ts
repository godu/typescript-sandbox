import { ask } from "../util";
import * as url from "node:url";

type App<Ports, Return> = (ports: Ports) => Return;
type GetPorts<A> = A extends App<infer P, unknown> ? P : never;

export const isEqual = <T>(first: T, second: T): boolean =>
  first === second;

export const getMessage = (isEqual: boolean): string =>
  isEqual
    ? "The two strings are equal"
    : "The two strings aren't equal";

export type Ask = (question: string) => Promise<string>;
export const run1: App<
  { ask: Ask },
  Promise<[string, string]>
> = async ({ ask }) => {
  const first = await ask("First ?");
  const second = await ask("Second ?");
  return [first, second];
};

export type Log = (message: string) => void;
export const run2: App<
  { log: Log },
  (result: boolean) => void
> =
  ({ log }) =>
  (result) => {
    const message = getMessage(result);
    return log(message);
  };

export const run: App<
  GetPorts<typeof run1> & GetPorts<typeof run2>,
  Promise<boolean>
> = async (ports) => {
  const [first, second] = await run1(ports);
  const result = isEqual(first, second);
  run2(ports)(result);
  return result;
};

export const main = () => run({ ask, log: console.log });

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
