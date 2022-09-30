import { ask, log } from "../util";
import * as url from "node:url";

export const main = async (): Promise<boolean> => {
  const first = await ask("First ?");
  const second = await ask("Second ?");

  const result = first === second;

  log(
    result
      ? "The two strings are equal"
      : "The two strings aren't equal"
  );

  return result;
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
