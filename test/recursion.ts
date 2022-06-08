import test from "ava";

function maximum(xs: Number[]): Number {
  if (xs.length === 0) return -Infinity;
  const [x, ...rest] = xs;
  const y = maximum(rest);
  return x > y ? x : y;
}

test("maximum", (t) => t.is(maximum([[0, 3, 1, 4, 2]]), 4));

maximum([0, 3, 1, 4, 2]);
maximum([3, 1, 4, 2]);
maximum([1, 4, 2]);
maximum([4, 2]);
maximum([2]);
maximum([]);

[1, 0, 6, 4, 2][(0, 6, 4, 2)][(6, 4, 2)];
