import * as url from "node:url";
import { ask, log, rand } from "../util";

export const main = async () => {
  
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
