import React from 'react';
import ReactDOM from 'react-dom';
import { Applicative1 } from 'fp-ts/es6/Applicative';
import { flow } from 'fp-ts/es6/function';
import { array, zipWith } from 'fp-ts/es6/Array';
import { of, Observable, combineLatest, timer } from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';
import { random } from 'lodash/fp';
import createApp from './bmi.multi';

flow(
    createApp({ ...array, join: zipWith }),
    views => ReactDOM.render(
        <div>
            {
                views.map((view, i) =>
                    <div key={i} > {view}</div>
                )
            }
        </div >,
        document.getElementById('array')
    )
)(
    {
        height: [170, 180],
        weight: [70, 50]
    }
)

declare module 'fp-ts/es6/HKT' {
    interface URItoKind<A> {
        Observable: Observable<A>
    }
}

const observable: Applicative1<'Observable'> & {
    join: <A, B, C>(fa: Observable<A>, fb: Observable<B>, f: (a: A, b: B) => C) => Observable<C>
} = {
    URI: 'Observable',
    of: (a) => of(a),
    map: (fa, f) => fa.pipe(map(a => f(a))),
    ap: (fab, fa) => observable.map(fab, f => observable.map(fa, f)).pipe(mergeAll()),
    join: (fa, fb, f) => combineLatest(fa, fb).pipe(map(([a, b]) => f(a, b)))
}

createApp(observable)({
    height: timer(0, 1000).pipe(map(() => random(120, 200))),
    weight: timer(500, 1000).pipe(map(() => random(50, 120)))
}).subscribe(
    view => ReactDOM.render(view, document.getElementById('observable'))
);
