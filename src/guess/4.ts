import * as url from "node:url";
import { ask, log, rand } from "../util";

type App<Ports, Return> = (ports: Ports) => Return;

export const main = async () => {
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main({
      ask: util.ask,
      log: util.log,
      rand: util.rand,
    });
  }
}
