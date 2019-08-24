export interface Nothing {
    readonly _tag: 'Nothing'
};
export interface Just<A> {
  readonly _tag: 'Just'
  readonly value: A
}
export type Maybe<A> = Nothing | Just<A>;

export const nothing: Maybe<never> = { _tag: 'Nothing' };
export function just<A>(value: A): Maybe<A> {
    return { _tag: 'Just', value };
}

export const of = just;

export function map<A, B>(f: (a: A) => B, ma: Maybe<A>) {
    if (ma._tag === 'Nothing') return nothing;
    else return just(f(ma.value));
};
