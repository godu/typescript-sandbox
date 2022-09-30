import * as url from "node:url";
import { main as one } from "./1";
import { main as two } from "./2";
import { main as three } from "./3";
import { main as four } from "./4";
import { main as five } from "./5";
import { main as six } from "./6";

export const main = async () => {
  await one();
  await two();
  await three();
  await four();
  await five();
  await six();
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
