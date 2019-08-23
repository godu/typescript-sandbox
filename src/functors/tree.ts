export interface Leaf { readonly _tag: 'Leaf' };
export interface Node<A> {
  readonly _tag: 'Node', readonly value: A
  readonly left: Tree<A>, readonly right: Tree<A>
}
export type Tree<A> = Leaf | Node<A>;

export const leaf: Tree<never> = { _tag: 'Leaf' };
export function node<A>(
    value: A, left: Tree<A> = leaf, right: Tree<A> = leaf
): Tree<A> {
    return { _tag: 'Node', value, left, right };
}

export function map<A, B>(f: (a: A) => B, ma: Tree<A>): Tree<B> {
    if (ma._tag === 'Leaf') return leaf;
    else return node(
        f(ma.value),
        map(f, ma.left),
        map(f, ma.right)
    );
}
