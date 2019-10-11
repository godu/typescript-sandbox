
import {ExecutionContext} from 'ava';

export function isReflexive<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    x: T
) {
    return t.true(
        equal(x, x),
        `${toString(x)} = ${toString(x)}`
    );
}

export function isSymmetric<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    x: T, y: T
) {
    return t.is(
        equal(x, y),
        equal(y, x),
        `if ${toString(x)} = ${toString(y)}, then ${toString(y)} = ${toString(x)}`
    );
}

export function isAntisymmetric<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    greaterOrEqual: (a: T, b: T) => boolean,
    x: T, y: T
) {
    return t.is(
        greaterOrEqual(x, y) && greaterOrEqual(y, x),
        equal(x, y),
        `if ${toString(x)} = ${toString(y)}, then ${toString(y)} = ${toString(x)}`
    );
}

export function isTransitive<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    x: T, y: T, z: T
) {
    if (equal(x, y) && equal(y, z)) {
        t.true(
            equal(x, z),
            `if ${toString(x)} = ${toString(y)} and ${toString(y)} = ${toString(z)}, then ${toString(x)} = ${toString(z)}`
        );
    }
}

export function isAssociative<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    add: (a: T, b: T) => T,
    x: T, y: T, z: T
) {
    return t.true(
        equal(
            add(x, add(y, z)),
            add(add(x, y), z)
        ),
        `${toString(x)} <> (${toString(y)} <> ${toString(z)}) = (${toString(x)} <> ${toString(y)}) <> ${toString(z)}`
    );
}

export function isIdentity<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    add: (a: T, b: T) => T,
    zero: T,
    x: T
) {
    t.true(
        equal(
            add(x, zero),
            x
        ),
        `${toString(x)} <> ${toString(zero)} = ${toString(x)}`
    );
    t.true(
        equal(
            add(zero, x),
            x
        ),
        `${toString(zero)} <> ${toString(x)} = ${toString(x)}`
    );
}

export function isCommutative<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    add: (a: T, b: T) => T,
    x: T, y: T
) {
    t.true(
        equal(
            add(x, y),
            add(y, x)
        ),
        `${toString(x)} <> ${toString(y)} = ${toString(y)} <> ${toString(x)}`
    );
}

export function isDistributive<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    add: (a: T, b: T) => T,
    multiply: (a: T, b: T) => T,
    x: T, y: T, z: T
) {
    t.true(
        equal(
            multiply(x, add(y, z)),
            add(multiply(x, y), multiply(x, z))
        ),
        `${toString(x)} * (${toString(y)} + ${toString(z)}) == (${toString(x)} * ${toString(y)}) + (${toString(x)} * ${toString(z)})`
    );
    t.true(
        equal(
            multiply(add(x, y), z),
            add(multiply(x, z), multiply(y, z))
        ),
        `(${toString(x)} + ${toString(y)}) * ${toString(z)}  == (${toString(x)} * ${toString(z)}) + (${toString(y)} * ${toString(z)})`
    );
}

export function isAnnihilative<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    multiply: (a: T, b: T) => T,
    zero: T,
    x: T,
) {
    t.true(
        equal(
            multiply(x, zero),
            zero
        ),
        `${toString(x)} <> ${toString(zero)} = ${toString(zero)}`
    );
    t.true(
        equal(
            multiply(zero, x),
            zero
        ),
        `${toString(zero)} <> ${toString(x)} = ${toString(zero)}`
    );
}

export function isInverseAdditive<T, C>(
    t: ExecutionContext<C>,
    toString: (a: T) => string,
    equal: (a: T, b: T) => boolean,
    add: (a: T, b: T) => T,
    negate: (a: T) => T,
    zero: T,
    x: T
) {
    t.true(
        equal(
            add(x, negate(x)),
            zero
        ),
        `${toString(x)} <> (-${toString(x)}) = ${toString(zero)}`
    );
}