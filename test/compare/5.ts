import test from "ava";
import {
  isEqual,
  run,
  run1,
  run2,
} from "../../src/compare/5";

test("isEqual", async (t) => {
  t.true(isEqual("foo", "foo"));
  t.false(isEqual("foo", "bar"));
});

test("run1#true", async (t) => {
  t.plan(3);

  const ask = (): Promise<string> => {
    t.pass();
    return Promise.resolve("bar");
  };

  t.deepEqual(await run1({ ask })(), ["bar", "bar"]);
});
test("run1#false", async (t) => {
  t.plan(3);

  const ask = (question: string): Promise<string> => {
    t.pass();
    switch (question) {
      case "First ?": {
        return Promise.resolve("foo");
      }
      default: {
        return Promise.resolve("bar");
      }
    }
  };

  t.deepEqual(await run1({ ask })(), ["foo", "bar"]);
});

test("run2#true", async (t) => {
  t.plan(1);

  const log = (message: string): void => {
    t.is(message, "The two strings are equal");
  };

  run2(true)({ log });
});
test("run2#false", async (t) => {
  t.plan(1);

  const log = (message: string): void => {
    t.is(message, "The two strings aren't equal");
  };

  run2(false)({ log });
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

  t.true(await run({ ask, log })());
});
test("run#false", async (t) => {
  t.plan(4);

  const ask = (question: string): Promise<string> => {
    t.pass();
    switch (question) {
      case "First ?": {
        return Promise.resolve("foo");
      }
      default: {
        return Promise.resolve("bar");
      }
    }
  };
  const log = (message: string): void => {
    t.is(message, "The two strings aren't equal");
  };

  t.false(await run({ ask, log })());
});
