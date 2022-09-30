import test from "ava";
import esmock from "esmock";
import Sinon from "sinon";

test("guess the number 5", async (t) => {
  const rand = Sinon.stub();
  const log = Sinon.stub();
  const ask = Sinon.stub();
  rand.withArgs(0, 10).onCall(0).returns(5);
  log.withArgs("Guess the number!").onCall(0).returns(void 0);
  ask.withArgs("Please input your guess: ").onCall(0).returns(Promise.resolve("3"));
  log.withArgs(`You guessed: 3`).onCall(0).returns(void 0);
  log.withArgs("Too small!").onCall(0).returns(void 0);
  ask.withArgs("Please input your guess: ").onCall(1).returns(Promise.resolve("7"));
  log.withArgs(`You guessed: 5`).onCall(0).returns(void 0);
  log.withArgs("Too big!").onCall(0).returns(void 0);
  ask.withArgs("Please input your guess: ").onCall(2).returns(Promise.resolve("5"));
  log.withArgs(`You guessed: 7`).onCall(0).returns(void 0);
  log.withArgs("You win!").onCall(0).returns(void 0);
  rand.throws();
  log.throws();
  ask.throws();


  const { main } = await esmock("../../src/guess/1", {
    "../../src/util": { rand, ask, log },
  });

  await t.notThrowsAsync(main());
  t.is(rand.callCount, 1);
  t.is(log.callCount, 7);
  t.is(ask.callCount, 3);
});
