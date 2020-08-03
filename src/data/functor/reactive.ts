import { of, Observable, pipe } from 'rxjs';
import { map as map_ } from 'rxjs/operators';

function map<A, B>(f: (a: A) => B, ma: Observable<A>) {
    return pipe(
        map_(f)
    )(ma);
};

export {
    of,
    map
};
