/*
    Implementation of Generalized Algebraic DataTypes using Leibniz equality

    What's GATDs ? https://en.wikibooks.org/wiki/Haskell/GADT#GADTs
    Leibniz equality in TypeScript https://medium.com/codestar-blog/leibniz-equality-in-typescript-2aeff1303749
    purescript-leibniz https://github.com/paf31/purescript-leibniz
*/

type Equal<A, B> = ((a: A) => B) & ((b: B) => A)
const identity = <T>(t: T): T => t;

export type Exp<A>
    = {
        type: "Int",
        id: Equal<A, number>,
        value: number
    }
    | {
        type: "Add",
        id: Equal<A, number>,
        values: [Exp<number>, Exp<number>]
    }
    | {
        type: "Mul",
        id: Equal<A, number>,
        values: [Exp<number>, Exp<number>]
    }
    | {
        type: "Bool",
        id: Equal<A, boolean>,
        value: boolean
    }
    | {
        type: "Eq",
        id: Equal<A, boolean>,
        values: [Exp<number>, Exp<number>]
    }

export const int = (a: number): Exp<number> => ({
    type: "Int",
    id: identity,
    value: a
});

export const add = (a: Exp<number>, b: Exp<number>): Exp<number> => ({
    type: "Add",
    id: identity,
    values: [a, b]
});

export const mul = (a: Exp<number>, b: Exp<number>): Exp<number> => ({ type: "Mul", id: identity, values: [a, b] });
export const bool = (a: boolean): Exp<boolean> => ({
    type: "Bool",
    id: identity,
    value: a
});

export const eq = (a: Exp<number>, b: Exp<number>): Exp<boolean> => ({
    type: "Eq",
    id: identity,
    values: [a, b]
});

export const evaluate = <A>(exp: Exp<A>): A => {
    switch (exp.type) {
        case "Int": {
            const {id, value} = exp;
            return id(value)
        }
        case "Add": {
            const {id, values: [a, b]} = exp;
            return id(evaluate(a) + evaluate(b))
        }
        case "Mul": {
            const {id, values: [a, b]} = exp;
            return id(evaluate(a) * evaluate(b))
        }
        case "Bool": {
            const {id, value} = exp;
            return id(value)
        }
        case "Eq": {
            const {id, values: [a, b]} = exp;
            return id(evaluate(a) === evaluate(b))
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
