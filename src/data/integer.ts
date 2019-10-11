import * as N from './peano';

export type Integer = [N.Peano, N.Peano];

export const zero: Integer = [N.zero, N.zero];

export const succ = ([x, y]: Integer): Integer => [N.succ(x), y];
export const pred = ([x, y]: Integer): Integer => [x, N.succ(y)];

export const one: Integer = succ(zero);

export const equal = ([x1, y1]: Integer, [x2, y2]: Integer) =>
    N.equal(
        N.add(x1, y2),
        N.add(y1, x2)
    );

export const add = ([x1, y1]: Integer, [x2, y2]: Integer): Integer =>
    [
        N.add(x1, x2),
        N.add(y1, y2)
    ];

export const multiply = ([x1, y1]: Integer, [x2, y2]: Integer): Integer =>
    [
        N.add(N.multiply(x1, x2), N.multiply(y1, y2)),
        N.add(N.multiply(x1, y2), N.multiply(y1, x2))
    ];

export const greaterOrEqual = ([x1, y1]: Integer, [x2, y2]: Integer): boolean => 
    N.greaterOrEqual(
        N.add(x1, y2),
        N.add(y1, x2)
    );

export const negate = ([x, y]: Integer): Integer => [y, x];

export function fromNumber(x: number): Integer {
    if (x >= 0) return [N.fromNumber(x), N.zero];
    return [N.zero, N.fromNumber(-x)];
}

export function toNumber([x, y]: Integer): number {
    return N.toNumber(x) - N.toNumber(y);
}

export function toString(x: Integer): string {
    return JSON.stringify(toNumber(x));
}