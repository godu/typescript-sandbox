import test from "ava";
import { testProp, fc } from "ava-fast-check";

import { App, evaluate, K, I, Ski, S } from "../src/ski";

const shouldBe = test.macro<[Ski, Ski]>((t, x, y) =>
  t.deepEqual(evaluate(x), y)
);

const { AppWithOnlyI: AppWithOnlyIArbitrary } = fc.letrec<{
  I: I;
  AppWithOnlyI: App;
}>((tie) => ({
  I: fc.constant(I),
  AppWithOnlyI: fc
    .tuple(
      fc.oneof({ depthSize: "small" }, tie("I"), tie("AppWithOnlyI")),
      fc.oneof({ depthSize: "small" }, tie("I"), tie("AppWithOnlyI"))
    )
    .map(([f, x]) => App(f, x)),
}));

test("I is irreducible", shouldBe, evaluate(I), I);
test("(I I) reduces to I", shouldBe, evaluate(App(I, I)), I);
test("(I (I I)) reduces to I", shouldBe, evaluate(App(I, App(I, I))), I);
test("((I I) I) reduces to I", shouldBe, evaluate(App(App(I, I), I)), I);
testProp(
  "arbitrarily nested applications of I only reduce to I",
  [AppWithOnlyIArbitrary],
  (t, ski) => t.deepEqual(evaluate(ski), I)
);
test("K is irreducible", shouldBe, evaluate(K), K);
test("(K I) is irreducible", shouldBe, evaluate(App(K, I)), App(K, I));
test("(K K) is irreducible", shouldBe, evaluate(App(K, K)), App(K, K));
testProp(
  "in (K x), we can't get rid of K but x should be reduced",
  [AppWithOnlyIArbitrary],
  (t, ski) => t.deepEqual(evaluate(App(K, ski)), App(K, I))
);
test("((K I) K) reduces to I", shouldBe, evaluate(App(App(K, I), K)), I);
test("((K K) I) reduces to K", shouldBe, evaluate(App(App(K, K), I)), K);
test(
  "K K I S K reduces to K",
  shouldBe,
  evaluate(App(App(App(App(K, K), I), S), K)),
  S
);
testProp("K argument reduces", [AppWithOnlyIArbitrary], (t, ski) =>
  t.deepEqual(evaluate(App(App(K, ski), K)), I)
);
test("S is irreducible", shouldBe, evaluate(S), S);
test("S I I I reduces to I", shouldBe, evaluate(App(App(App(S, I), I), I)), I);
test("S K K I reduces to I", shouldBe, evaluate(App(App(App(S, K), K), I)), I);

test(
  "SKI(KIS) reduces to I",
  shouldBe,
  evaluate(App(App(App(S, K), I), App(App(K, I), S))),
  I
);
test(
  "KS(I(SKSI)) reduces to S",
  shouldBe,
  evaluate(App(App(K, S), App(I, App(App(App(S, K), S), I)))),
  S
);
test("SKIK reduces to K", shouldBe, evaluate(App(App(App(S, K), I), K)), K);
