import * as url from "node:url";
import * as O from "fp-ts/lib/Option";
import * as N from "fp-ts/lib/number";
import { pipe } from "fp-ts/lib/function";
import { ask, log, rand } from "../util";

export const toInteger = (input: string): O.Option<number> => {
  const result = parseInt(input, 10);
  if (Number.isInteger(result)) return O.some(result);
  return O.none;
};

export const main = async () => {
  log("Guess the number!");
  const secretNumber = rand(0, 10);

  const loop = async (): Promise<void> => {
    const input = await ask("Please input your guess: ");
    log(`You guessed: ${input}`);

    return pipe(
      input,
      toInteger,
      O.fold(
        () => loop(),
        (guess: number) => {
          switch (N.Ord.compare(secretNumber, guess)) {
            case 1: {
              log("Too small!");
              return loop();
            }
            case -1: {
              log("Too big!");
              return loop();
            }
            case 0: {
              log("You win!");
              return;
            }
          }
        }
      )
    );
  };
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main();
  }
}
