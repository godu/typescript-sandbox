/*
    Implementation of Generalized Algebraic DataTypes using Leibniz equality

    What's GATDs ? https://en.wikibooks.org/wiki/Haskell/GADT#GADTs
    Leibniz equality in TypeScript https://medium.com/codestar-blog/leibniz-equality-in-typescript-2aeff1303749
    purescript-leibniz https://github.com/paf31/purescript-leibniz
*/

type Coercible<A, B> = ((a: A) => B) & ((b: B) => A)
const identity = <T>(t: T): T => t;

export type Exp<A>
    = {
        type: "Int",
        coerce: Coercible<A, number>,
        value: number
    }
    | {
        type: "Add",
        coerce: Coercible<A, number>,
        values: [Exp<number>, Exp<number>]
    }
    | {
        type: "Mul",
        coerce: Coercible<A, number>,
        values: [Exp<number>, Exp<number>]
    }
    | {
        type: "Bool",
        coerce: Coercible<A, boolean>,
        value: boolean
    }
    | {
        type: "Eq",
        coerce: Coercible<A, boolean>,
        values: [Exp<number>, Exp<number>]
    }

export const int = (a: number): Exp<number> => ({
    type: "Int",
    coerce: identity,
    value: a
});

export const add = (a: Exp<number>, b: Exp<number>): Exp<number> => ({
    type: "Add",
    coerce: identity,
    values: [a, b]
});

export const mul = (a: Exp<number>, b: Exp<number>): Exp<number> => ({ type: "Mul", coerce: identity, values: [a, b] });
export const bool = (a: boolean): Exp<boolean> => ({
    type: "Bool",
    coerce: identity,
    value: a
});

export const eq = (a: Exp<number>, b: Exp<number>): Exp<boolean> => ({
    type: "Eq",
    coerce: identity,
    values: [a, b]
});

export const evaluate = <A>(exp: Exp<A>): A => {
    switch (exp.type) {
        case "Int": {
            const {coerce, value} = exp;
            return coerce(value)
        }
        case "Add": {
            const {coerce, values: [a, b]} = exp;
            return coerce(evaluate(a) + evaluate(b))
        }
        case "Mul": {
            const {coerce, values: [a, b]} = exp;
            return coerce(evaluate(a) * evaluate(b))
        }
        case "Bool": {
            const {coerce, value} = exp;
            return coerce(value)
        }
        case "Eq": {
            const {coerce, values: [a, b]} = exp;
            return coerce(evaluate(a) === evaluate(b))
        }
    }
}

export const show = <A>(exp: Exp<A>): string => {
    switch (exp.type) {
        case "Int": {
            return `${exp.value}`
        }
        case "Add": {
            const {values: [a, b]} = exp;
            return `(${show(a)}) + (${show(b)})`
        }
        case "Mul": {
            const {values: [a, b]} = exp;
            return `(${show(a)}) * (${show(b)})`
        }
        case "Bool": {
            return `${exp.value}`
        }
        case "Eq": {
            const {values: [a, b]} = exp;
            return `(${show(a)}) == (${show(b)})`
        }
    }
}
