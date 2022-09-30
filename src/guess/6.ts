import * as url from "node:url";
import { ask, log, rand, perform } from "../util";

export const run = function* () {
};

export const handler = (effect: never): any => {
};


export const main = () => {
  return perform(run(), handler);
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
