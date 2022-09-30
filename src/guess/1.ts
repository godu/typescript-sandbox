import * as url from "node:url";
import { ask, log, rand } from "../util";

export const main = async () => {
  log("Guess the number!");
  const secretNumber = rand(0, 10);
  
  while (true) {
    const guess = parseInt(await ask("Please input your guess: "), 10);
    log(`You guessed: ${guess}`);
    if (!Number.isInteger(guess)) continue;
    else if (secretNumber > guess) log("Too small!");
    else if (secretNumber < guess) log("Too big!");
    else {
      log("You win!");
      break;
    }
  }
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
