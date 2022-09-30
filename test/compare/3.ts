import test from "ava";
import { isEqual, run } from "../../src/compare/3";

test("isEqual", async (t) => {
  t.true(isEqual("foo", "foo"));
  t.false(isEqual("foo", "bar"));
});

test("run#true", async (t) => {
  t.plan(4);

  const ask = (): Promise<string> => {
    t.pass();
    return Promise.resolve("bar");
  };
  const log = (message: string): void => {
    t.is(message, "The two strings are equal");
  };

  t.true(await run(ask, log));
});
test("run#false", async (t) => {
  t.plan(4);

  const ask = (question: string): Promise<string> => {
    t.pass();
    return Promise.resolve(
      question === "First ?" ? "foo" : "bar"
    );
  };
  const log = (message: string): void => {
    t.is(message, "The two strings aren't equal");
  };

  t.false(await run(ask, log));
});
