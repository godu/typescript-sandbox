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

// Boolean logic

const TRUE = K;
const FALSE = App(S, K);
const NOT = (x: Ski): Ski => App(App(x, FALSE), TRUE);
const AND = (x: Ski, y: Ski) => App(App(x, y), x);
const OR = (x: Ski, y: Ski) => App(App(x, x), y);
const XOR = (x: Ski, y: Ski) => OR(AND(x, NOT(y)), AND(NOT(x), y));
const IFTHENELSE = (x: Ski, y: Ski, z: Ski) => App(App(x, y), z);

test("NOT(TRUE)", shouldBe, evaluate(NOT(TRUE)), FALSE);
test("NOT(FALSE)", shouldBe, evaluate(NOT(FALSE)), TRUE);
test("NOT(NOT(TRUE))", shouldBe, evaluate(NOT(NOT(TRUE))), TRUE);
test("NOT(NOT(FALSE))", shouldBe, evaluate(NOT(NOT(FALSE))), FALSE);

test("AND(TRUE, TRUE)", shouldBe, evaluate(AND(TRUE, TRUE)), TRUE);
test("AND(TRUE, FALSE)", shouldBe, evaluate(AND(TRUE, FALSE)), FALSE);
test("AND(FALSE, TRUE)", shouldBe, evaluate(AND(FALSE, TRUE)), FALSE);
test("AND(FALSE, FALSE)", shouldBe, evaluate(AND(FALSE, FALSE)), FALSE);

test("OR(TRUE, TRUE)", shouldBe, evaluate(OR(TRUE, TRUE)), TRUE);
test("OR(TRUE, FALSE)", shouldBe, evaluate(OR(TRUE, FALSE)), TRUE);
test("OR(FALSE, TRUE)", shouldBe, evaluate(OR(FALSE, TRUE)), TRUE);
test("OR(FALSE, FALSE)", shouldBe, evaluate(OR(FALSE, FALSE)), FALSE);

test("XOR(TRUE, TRUE)", shouldBe, evaluate(XOR(TRUE, TRUE)), FALSE);
test("XOR(TRUE, FALSE)", shouldBe, evaluate(XOR(TRUE, FALSE)), TRUE);
test("XOR(FALSE, TRUE)", shouldBe, evaluate(XOR(FALSE, TRUE)), TRUE);
test("XOR(FALSE, FALSE)", shouldBe, evaluate(XOR(FALSE, FALSE)), FALSE);

test(
  "IFTHENELSE(TRUE, TRUE, FALSE)",
  shouldBe,
  evaluate(IFTHENELSE(TRUE, TRUE, FALSE)),
  TRUE
);
test(
  "IFTHENELSE(FLASE,  FALSE, TRUE)",
  shouldBe,
  evaluate(IFTHENELSE(FALSE, FALSE, TRUE)),
  TRUE
);

// https://en.wikipedia.org/wiki/Lambda_calculus#Arithmetic_in_lambda_calculus

const ZERO = App(K, I);
const ONE = I;

const ISZERO = (x: Ski) => App(App(x, App(K, FALSE)), TRUE);
const SUCC = (x: Ski) => App(x, App(S, App(App(S, App(K, S)), K)));
const ADD = (x: Ski, y: Ski): Ski => App(y, SUCC(x));

test("ISZERO(ZERO)", shouldBe, evaluate(ISZERO(ZERO)), TRUE);
test("SUCC(ZERO) reduces to ONE", shouldBe, evaluate(SUCC(ZERO)), ONE);
