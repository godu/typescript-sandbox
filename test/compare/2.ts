import test from "ava";
import { isEqual, getMessage } from "../../src/compare/2";

test("isEqual", async (t) => {
  t.true(isEqual("foo", "foo"));
  t.false(isEqual("foo", "bar"));
});

test("getMessage", async (t) => {
  t.is(getMessage(true), "The two strings are equal");
  t.is(getMessage(false), "The two strings aren't equal");
});
