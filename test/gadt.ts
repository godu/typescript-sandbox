import test from "ava";

import { int, bool, mul, add, eq, evaluate, show, Exp } from "../src/gadt";

const macro = <T>() =>
  test.macro<[Exp<T>, T]>({
    exec(t, expr, expected) {
      const actual = evaluate(expr);
      t.is(actual, expected);
    },
    title(_, exp) {
      return show(exp);
    },
  });

test(macro<number>(), int(1), 1);
test(macro<number>(), add(int(1), int(2)), 3);
test(macro<number>(), mul(int(2), int(3)), 6);
test(macro<boolean>(), bool(true), true);
test(macro<boolean>(), eq(int(1), int(1)), true);

test(macro<boolean>(), eq(add(int(2), int(4)), mul(int(2), int(3))), true);
