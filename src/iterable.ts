
export const take = (n: number) => function * <A>(xs: Iterable<A>): Iterable<A> {
	for (const x of xs) {
		if (n-- === 0) {
			break;
		}

		yield x;
	}
};
