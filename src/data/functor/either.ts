export interface Left<E, A> {
    readonly _tag: 'Left',
    value: E
};
export interface Right<E, A> {
    readonly _tag: 'Right',
    value: A
};
export type Either<E, A> = Left<E, A> | Right<E, A>;

export function left<E, A>(value: E): Either<E, A> {
    return { _tag: 'Left', value };
}
export function right<E, A>(value: A): Either<E, A> {
    return { _tag: 'Right', value };
}
export const of = right;

export function map<E, A, B>(f: (a: A) => B, ma: Either<E, A>) {
    if (ma._tag === 'Left') return ma;
    else return right(f(ma.value));
}
