import test from "ava";
import { fix } from "../src/fix";
import { always } from "ramda";
import { force, Lazy } from "../src/data/functor/lazy";
import { Tree, node } from "../src/data/functor/tree";

const macro = <A>() =>
  test.macro<[Lazy<A>, A]>((t, actual, expected) => {
    t.deepEqual(force(actual), expected);
  });

const factorial = fix<(a: number) => number>(
  (rec) => (n) => n <= 1 ? 1 : n * force(rec)(n - 1)
);
test("factorial(5)", macro(), () => factorial(5), 120);

test(
  'always("hello, haskell")',
  macro(),
  () => fix(always("hello, haskell")),
  "hello, haskell"
);

const repeat = <T>(n: T) =>
  fix<(i: number) => T[]>(
    (rec) => (i) => i <= 0 ? [] : [n, ...force(rec)(i - 1)]
  );
test('repeat("foo")(5)', macro(), () => repeat("foo")(5), [
  "foo",
  "foo",
  "foo",
  "foo",
  "foo",
]);
test("repeat(42)(2)", macro(), () => repeat(42)(2), [42, 42]);

const tree: Tree<number> = node(1, node(2, node(3), node(4, node(5))), node(6));
/*
1
├── 2
│   ├── 3
│   └── 4
│       └── 5
└── 6
*/
const sum = fix<(tree: Tree<number>) => number>(
  (rec) => (tree) =>
    tree._tag === "Leaf" ? 0 : tree.value + rec()(tree.left) + rec()(tree.right)
);
test("sum(tree)", macro(), () => sum(tree), 21);
