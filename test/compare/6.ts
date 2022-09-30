import test from "ava";
import {
  Ask,
  isEqual,
  Log,
  run,
  run1,
  run2,
} from "../../src/compare/6";
import { perform } from "../../src/util";

test("isEqual", async (t) => {
  t.true(isEqual("foo", "foo"));
  t.false(isEqual("foo", "bar"));
});

test("run1#true", async (t) => {
  t.plan(3);

  const handler = (effect: Ask) => {
    t.is(effect.type, "Ask");
    return Promise.resolve("bar");
  };

  t.deepEqual(await perform(run1(), handler), [
    "bar",
    "bar",
  ]);
});
test("run1#false", async (t) => {
  t.plan(3);

  const handler = (effect: Ask) => {
    t.is(effect.type, "Ask");
    switch (effect.payload) {
      case "First ?": {
        return Promise.resolve("foo");
      }
      default: {
        return Promise.resolve("bar");
      }
    }
  };

  t.deepEqual(await perform(run1(), handler), [
    "foo",
    "bar",
  ]);
});

test("run2#true", async (t) => {
  t.plan(1);

  const handler = (effect: Log) => {
    t.is(effect.payload, "The two strings are equal");
    return Promise.resolve();
  };

  await perform(run2(true)(), handler);
});
test("run2#false", async (t) => {
  t.plan(1);

  const handler = (effect: Log) => {
    t.is(effect.payload, "The two strings aren't equal");
    return Promise.resolve();
  };

  perform(run2(false)(), handler);
});

test("run#true", async (t) => {
  t.plan(4);

  const handler = (effect: Ask | Log): any => {
    switch (effect.type) {
      case "Ask":
        t.pass();
        return Promise.resolve("bar");
      case "Log": {
        t.is(effect.payload, "The two strings are equal");
        return Promise.resolve();
      }
    }
  };

  t.true(await perform(run(), handler));
});
test("run#false", async (t) => {
  t.plan(4);

  const handler = (effect: Ask | Log): any => {
    switch (effect.type) {
      case "Ask":
        t.pass();
        switch (effect.payload) {
          case "First ?": {
            return Promise.resolve("foo");
          }
          default: {
            return Promise.resolve("bar");
          }
        }
      case "Log":
        t.is(
          effect.payload,
          "The two strings aren't equal"
        );
        return Promise.resolve();
    }
  };

  t.false(await perform(run(), handler));
});
