import { ask, log } from "../util";
import * as url from "node:url";

export const isEqual = <T>(first: T, second: T): boolean =>
  first === second;

export const getMessage = (isEqual: boolean): string =>
  isEqual
    ? "The two strings are equal"
    : "The two strings aren't equal";

export const main = async (): Promise<boolean> => {
  const first = await ask("First ?");
  const second = await ask("Second ?");
  const result = isEqual(first, second);
  const message = getMessage(result);
  log(message);
  return result;
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
