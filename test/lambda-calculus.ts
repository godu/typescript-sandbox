import test from "ava";
import { parse, variable, Variable } from "../src/lambda-calculus";
import { some, none } from "fp-ts/lib/Option";

const parseMacro = test.macro<[string, Variable?, string?]>({
  exec(t, input, expected, rest = "") {
    const actual = parse(input);
    if (expected) t.deepEqual(actual, some([expected, rest]));
    else t.deepEqual(actual, none);
  },
  title(_providedTitle, input, expected) {
    return expected
      ? `parse(${input}) === Variable(${expected.name})`
      : `parse(${input}) === None`;
  },
});

test(parseMacro, "x", variable("x"));
test(parseMacro, "x1x2", variable("x1"), "x2");
test(parseMacro, "x10", variable("x10"));
test(parseMacro, "");
