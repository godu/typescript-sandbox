/*
    Implementation of Generalized Algebraic DataTypes using Leibniz equality

    What's GATDs ? https://en.wikibooks.org/wiki/Haskell/GADT#GADTs
    Leibniz equality in TypeScript https://medium.com/codestar-blog/leibniz-equality-in-typescript-2aeff1303749
    purescript-leibniz https://github.com/paf31/purescript-leibniz
*/

type Equal<A, B> = ((a: A) => B) & ((b: B) => A)
const identity = <T>(t: T): T => t;

export type Exp<A>
    = ["Int", Equal<A, number>, number]
    | ["Add", Equal<A, number>, Exp<number>, Exp<number>]
    | ["Mul", Equal<A, number>, Exp<number>, Exp<number>]
    | ["Bool", Equal<A, boolean>, boolean]
    | ["Eq", Equal<A, boolean>, Exp<number>, Exp<number>]

export const int = (a: number): Exp<number> => ["Int", identity, a];
export const add = (a: Exp<number>, b: Exp<number>): Exp<number> => ["Add", identity, a, b];
export const mul = (a: Exp<number>, b: Exp<number>): Exp<number> => ["Mul", identity, a, b];
export const bool = (a: boolean): Exp<boolean> => ["Bool", identity, a];
export const eq = (a: Exp<number>, b: Exp<number>): Exp<boolean> => ["Eq", identity, a, b];

export const evaluate = <A>(a: Exp<A>): A => {
    switch(a[0]) {
        case "Int": {
            return a[1](a[2])
        }
        case "Add": {
            return a[1](evaluate(a[2]) + evaluate(a[3]))
        }
        case "Mul": {
            return a[1](evaluate(a[2]) * evaluate(a[3]))
        }
        case "Bool": {
            return a[1](a[2])
        }
        case "Eq": {
            return a[1](evaluate(a[2]) === evaluate(a[3]))
        }
    }
}

export const show = <A>(a: Exp<A>): string => {
    switch(a[0]) {
        case "Int": {
            return `${a[2]}`
        }
        case "Add": {
            return `(${show(a[2])}) + (${show(a[3])})`
        }
        case "Mul": {
            return `(${show(a[2])}) * (${show(a[3])})`
        }
        case "Bool": {
            return `${a[2]}`
        }
        case "Eq": {
            return `(${show(a[2])}) == (${show(a[3])})`
        }
    }
}
