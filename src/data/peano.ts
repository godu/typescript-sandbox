export type Peano = Zero | Succ;

export type Zero = {
    type: "Zero"
};


export type Succ = {
    type: "Succ",
    value: Peano
};

export const isZero = (x: Peano): x is Zero => x.type === "Zero";
export const isSucc = (x: Peano): x is Succ => x.type === "Succ";

export const zero: Zero = {
    type: "Zero"
};

export const succ = (value: Peano): Succ => ({
    type: "Succ",
    value
});
export const pred = (value: Succ): Peano => value.value;

export const one: Succ = succ(zero);

export const equal = (x: Peano, y: Peano): boolean => {
    if (isZero(x) && isZero(y)) return true;
    if (isZero(x)) return false;
    if (isZero(y)) return false;
    return equal(pred(x), pred(y));
};

// export const equal = (x: Peano, y: Peano): boolean => {
//     let x_ = x;
//     let y_ = y;
//     while (true) {
//         if (isZero(x_) && isZero(y_)) return true;
//         if (isZero(x_)) return false;
//         if (isZero(y_)) return false;
//         x_ = pred(x_);
//         y_ = pred(y_);
//     }
// };

export const add = (x: Peano, y: Peano): Peano => {
    if (isZero(y)) return x;
    return succ(add(x, pred(y)));
};

// export const add = (x: Peano, y: Peano): Peano => {
//     let y_ = y;
//     let result = x;
//     while (true) {
//         if (isZero(y_)) return result;
//         result = succ(result);
//         y_ = pred(y_);
//     }
// };

export const multiply = (x: Peano, y: Peano): Peano => {
    if (isZero(y)) return y;
    return add(x, multiply(x, pred(y)));
};

// export const multiply = (x: Peano, y: Peano): Peano => {
//     let y_ = y;
//     let result: Peano = zero;
//     while (true) {
//         if (isZero(y_)) return result;
//         result = add(x, result);
//         y_ = pred(y_)
//     }
// };

// export const greaterOrEqual = (x: Peano, y: Peano): -1 | 0 | 1 => {
//     if (isZero(x) && isZero(y)) return 0;
//     if (isZero(x)) return 1;
//     if (isZero(y)) return -1;
//     return greaterOrEqual(pred(x), pred(y));
// };

export const greaterOrEqual = (x: Peano, y: Peano): boolean => {
    let x_ = x;
    let y_ = y;
    while (true) {
        if (isZero(x_) && isZero(y_)) return true;
        if (isZero(x_)) return true;
        if (isZero(y_)) return false;
        x_ = pred(x_);
        y_ = pred(y_);
    }
};

export const fromNumber = (x: number): Peano => {
    if (x === 0) return zero;
    return succ(fromNumber(x - 1));
};

// export const fromNumber = (x: number): Peano => {
//     let x_ = x;
//     let result: Peano = zero;
//     while (true) {
//         if (x_ === 0) return result;
//         x_ = x_ - 1;
//         result = succ(result);
//     }
// };

export const toNumber = (x: Peano): number => {
    if (isZero(x)) return 0;
    return 1 + toNumber(pred(x));
};

// export const toNumber = (x: Peano): number => {
//     let x_ = x;
//     let res = 0;
//     while (true) {
//         if (isZero(x_)) return res;
//         res = res + 1;
//         x_ = pred(x_);
//     }
// };

export const toString = (x: Peano): string => {
    return JSON.stringify(toNumber(x));
};
