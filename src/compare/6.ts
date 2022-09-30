import * as url from "node:url";
import * as util from "../util";

export const isEqual = <T>(first: T, second: T): boolean =>
  first === second;

export const getMessage = (isEqual: boolean): string =>
  isEqual
    ? "The two strings are equal"
    : "The two strings aren't equal";

export type Ask = { type: "Ask"; payload: string };
const ask = (question: string): Ask => ({
  type: "Ask",
  payload: question,
});
export const run1 = function* (): Generator<
  Ask,
  [string, string],
  string
> {
  const first = yield ask("First ?");
  const second = yield ask("Second ?");
  return [first, second];
};

export type Log = { type: "Log"; payload: string };
const log = (message: string): Log => ({
  type: "Log",
  payload: message,
});
export const run2 = (result: boolean) =>
  function* (): Generator<Log, void, void> {
    const message = getMessage(result);
    yield log(message);
  };

export const run = function* () {
  const [first, second] = yield* run1();
  const result = isEqual(first, second);
  yield* run2(result)();
  return result;
};

export const main = () => {
  const handler = (effect: Ask | Log): any => {
    switch (effect.type) {
      case "Ask":
        return util.ask(effect.payload);
      case "Log":
        return util.log(effect.payload);
    }
  };
  return util.perform(run(), handler);
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
