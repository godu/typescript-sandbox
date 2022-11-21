import * as url from "node:url";
import * as O from "fp-ts/lib/Option";
import * as N from "fp-ts/lib/number";
import { pipe } from "fp-ts/lib/function";
import * as R from "fp-ts/lib/ReaderTask";
import * as util from "../util";

export const toInteger = (input: string): O.Option<number> => {
  const result = parseInt(input, 10);
  if (Number.isInteger(result)) return O.some(result);
  return O.none;
};

const ask = (question: string) =>
  R.asksReaderTask(({ ask }: { ask: (question: string) => Promise<string> }) =>
    R.fromTask(() => ask(question))
  );

const log = (message: string) =>
  R.asks(({ log }: { log: (message: string) => void }) => log(message));

const rand = (min: number, max: number) =>
  R.asks(({ rand }: { rand: (min: number, max: number) => number }) =>
    rand(min, max)
  );

const loop = (
  secretNumber: number
): R.ReaderTask<
  {
    ask: (question: string) => Promise<string>;
    log: (message: string) => void;
  },
  void
> =>
  pipe(
    ask("Please input your guess: "),
    R.chainFirstW((input) => log(`You guessed: ${input}`)),
    R.map(toInteger),
    R.chain(
      O.fold(
        () => loop(secretNumber),
        (guess: number) => {
          switch (N.Ord.compare(secretNumber, guess)) {
            case 1: {
              return pipe(
                log("Too small!"),
                R.chain(() => loop(secretNumber))
              );
            }
            case -1: {
              return pipe(
                log("Too big!"),
                R.chain(() => loop(secretNumber))
              );
            }
            case 0: {
              return pipe(
                log("You win!"),
                R.chain(() => R.of(void 0))
              );
            }
          }
        }
      )
    )
  );

export const main = pipe(
  log("Guess the number!"),
  R.chainW(() => rand(0, 10)),
  R.chainW(loop)
);

if (import.meta.url.startsWith("file:")) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    main({
      ask: util.ask,
      log: util.log,
      rand: util.rand,
    })();
  }
}
