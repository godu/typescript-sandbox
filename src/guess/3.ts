import * as url from "node:url";
import * as O from "fp-ts/lib/Option";
import * as N from "fp-ts/lib/number";
import { pipe } from "fp-ts/lib/function";
import * as util from "../util";

export const toInteger = (input: string): O.Option<number> => {
  const result = parseInt(input, 10);
  if (Number.isInteger(result)) return O.some(result);
  return O.none;
};

const loop = async (
  ask: (question: string) => Promise<string>,
  log: (message: string) => void,
  secretNumber: number
): Promise<boolean> => {
  const input = await ask("Please input your guess: ");
  log(`You guessed: ${input}`);

  return pipe(
    input,
    toInteger,
    O.fold(
      () => false,
      (guess: number) => {
        switch (N.Ord.compare(secretNumber, guess)) {
          case 1: {
            log("Too small!");
            return false;
          }
          case -1: {
            log("Too big!");
            return false;
          }
          case 0: {
            log("You win!");
            return true;
          }
        }
      }
    )
  );
};

export const main = async (
  ask: (question: string) => Promise<string>,
  log: (message: string) => void,
  rand: (min: number, max: number) => number
): Promise<void> => {
  log("Guess the number!");
  const secretNumber = rand(0, 10);
  while (!(await loop(ask, log, secretNumber)));
};

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main(util.ask, util.log, util.rand);
  }
}
