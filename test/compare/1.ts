import test from "ava";
import esmock from "esmock";
import Sinon from "sinon";

test("foo == foo", async (t) => {
  const ask = Sinon.stub();
  const log = Sinon.stub();
  ask.withArgs("First ?").onFirstCall().returns(Promise.resolve("foo"));
  ask.withArgs("Second ?").onFirstCall().returns(Promise.resolve("foo"));
  log.withArgs("The two strings are equal").onFirstCall().returns(void 0);
  ask.throws();
  log.throws();

  const { main } = await esmock("../../src/compare/1", {
    "../../src/util": { ask, log },
  });

  t.true(await main());
  t.is(ask.callCount, 2);
  t.is(log.callCount, 1);
});

test("foo != bar", async (t) => {
  const ask = Sinon.stub();
  const log = Sinon.stub();
  ask.withArgs("First ?").onFirstCall().returns(Promise.resolve("foo"));
  ask.withArgs("Second ?").onFirstCall().returns(Promise.resolve("bar"));
  log.withArgs("The two strings aren't equal").onFirstCall().returns(void 0);
  ask.throws();
  log.throws();

  const { main } = await esmock("../../src/compare/1", {
    "../../src/util": { ask, log },
  });

  t.false(await main());
  t.is(ask.callCount, 2);
  t.is(log.callCount, 1);
});
