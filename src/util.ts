import { createInterface } from "readline/promises";

export const ask = async (question: string): Promise<string> => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await rl.question(question);
  rl.close();
  return answer;
};

export const log: (message: string) => void = console.log;

export const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max + 1 - min) + min);

export const perform = async <T = unknown, TReturn = any, TNext = unknown>(
  gen: Generator<T, TReturn, TNext>,
  handler: (effect: T) => Promise<TNext>,
  ...args: any
): Promise<TReturn> => {
  const { value, done } = gen.next(...args);
  if (done) return value;
  return perform(gen, handler, await handler(value));
};
