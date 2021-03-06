import test from 'ava';
import { isReflexive, isSymmetric, isTransitive, isAssociative, isIdentity, isCommutative, isDistributive, isAnnihilative, isAntisymmetric, isInverseAdditive } from '../helpers/quickcheck';
import { fromNumber, equal, add, zero, multiply, one, greaterOrEqual, negate } from '../../src/data/integer';
import { random } from 'lodash/fp';

const INTEGER_MIN = -10;
const INTEGER_MAX = 10;

test('Eq', t => {
    for (let i = 0; i < 100; i++) {
        const x = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const y = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const z = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        isReflexive(t, toString, equal, x);
        isSymmetric(t, toString, equal, x, y);
        isTransitive(t, toString, equal, x, y, z);
    }
    t.true(equal(fromNumber(0), fromNumber(0)), "0 == 0");
    t.false(equal(fromNumber(1), fromNumber(0)), "1 != 0");
    t.false(equal(fromNumber(0), fromNumber(1)), "0 != 1");
    t.true(equal(fromNumber(1), fromNumber(1)), "1 == 1");
});

test('Monoid', t => {
    for (let i = 0; i < 100; i++) {
        const x = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const y = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const z = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        isAssociative(t, toString, equal, add, x, y, z);
        isIdentity(t, toString, equal, add, zero, x);
        isCommutative(t, toString, equal, add, x, y);
    }
    t.true(equal(add(fromNumber(0), fromNumber(0)), fromNumber(0)), "0 + 0 = 0");
    t.true(equal(add(fromNumber(1), fromNumber(0)), fromNumber(1)), "1 + 0 = 1");
    t.true(equal(add(fromNumber(0), fromNumber(1)), fromNumber(1)), "0 + 1 = 1");
    t.true(equal(add(fromNumber(1), fromNumber(1)), fromNumber(2)), "1 + 1 = 2");
});

test('Semiring', t => {
    for (let i = 0; i < 100; i++) {
        const x = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const y = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const z = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        isAssociative(t, toString, equal, multiply, x, y, z);
        isIdentity(t, toString, equal, multiply, one, x);
        isDistributive(t, toString, equal, add, multiply, x, y, z);
        isAnnihilative(t, toString, equal, multiply, zero, x);
    }
    t.true(equal(multiply(fromNumber(0), fromNumber(0)), fromNumber(0)), "0 * 0 = 0");
    t.true(equal(multiply(fromNumber(1), fromNumber(0)), fromNumber(0)), "1 * 0 = 0");
    t.true(equal(multiply(fromNumber(0), fromNumber(1)), fromNumber(0)), "0 * 1 = 0");
    t.true(equal(multiply(fromNumber(1), fromNumber(1)), fromNumber(1)), "1 * 1 = 1");
    t.true(equal(multiply(fromNumber(2), fromNumber(1)), fromNumber(2)), "2 * 1 = 2");
    t.true(equal(multiply(fromNumber(1), fromNumber(2)), fromNumber(2)), "1 * 2 = 2");
    t.true(equal(multiply(fromNumber(2), fromNumber(2)), fromNumber(4)), "2 * 2 = 4");
});

test('Ord', t => {
    for (let i = 0; i < 100; i++) {
        const x = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const y = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const z = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        isReflexive(t, toString, greaterOrEqual, x);
        isAntisymmetric(t, toString, equal, greaterOrEqual, x, y);
        isTransitive(t, toString, greaterOrEqual, x, y, z);
    }
    t.true(greaterOrEqual(fromNumber(0), fromNumber(0)), "0 <= 0");
    t.true(greaterOrEqual(fromNumber(0), fromNumber(1)), "0 <= 1");
    t.false(greaterOrEqual(fromNumber(1), fromNumber(0)), "1 <!= 0");
    t.true(greaterOrEqual(fromNumber(1), fromNumber(1)), "1 <= 1");
});


test('Ring', t => {
    for (let i = 0; i < 100; i++) {
        const x = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const y = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        const z = fromNumber(random(INTEGER_MIN, INTEGER_MAX));
        isInverseAdditive(t, toString, equal, add, negate, zero, x);
    }
});
