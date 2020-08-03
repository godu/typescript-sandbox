
import React from 'react';
import ReactDOM from 'react-dom';
import { random } from 'lodash/fp';
import { Kind, URIS } from 'fp-ts/es6/HKT';
import { Applicative1 } from 'fp-ts/es6/Applicative';
import { identity } from 'fp-ts/es6/Identity';
import { option } from 'fp-ts/es6/Option';
import { io } from 'fp-ts/es6/IO';
import { task, delay as tDelay } from 'fp-ts/es6/Task';
import { array } from 'fp-ts/es6/Array';
import { of, Observable, combineLatest, timer } from 'rxjs';
import { map, delay } from 'rxjs/operators';

const App = <F extends URIS>(F: Applicative1<F>) => ({
    height: fHeight,
    weight: fWeight
}: {
    height: Kind<F, number>;
    weight: Kind<F, number>;
}) => {
    const fHeightMeters =
        F.map(
            fHeight,
            (height: number) => height * 0.01
        );

    const fBMI =
        F.ap(
            F.map(
                fHeight,
                (height: number) =>
                    (heightMeters: number) =>
                        Math.round(
                            height /
                            (heightMeters * heightMeters)
                        )

            ),
            fHeightMeters
        );

    return (
        F.ap(
            F.ap(
                F.map(
                    fHeight,
                    (height: number) =>
                        (weight: number) =>
                            (BMI: number) => (
                                <div>
                                    <div>
                                        {`Weight ${weight}kg`}
                                    </div>
                                    <div>
                                        {`Height ${height}kg`}
                                    </div>
                                    <h2>
                                        {`BMI is ${BMI}`}
                                    </h2>
                                </div>
                            )
                ),
                fWeight
            ),
            fBMI
        )
    );
}


identity.map(
    App(identity)({
        height: identity.of(170),
        weight: identity.of(70)
    }),
    view => ReactDOM.render(view, document.getElementById('identity'))
);

option.map(
    App(option)({
        height: option.of(170),
        weight: option.of(70)
    }),
    view => ReactDOM.render(view, document.getElementById('option'))
);

setTimeout(
    io.map(
        App(io)({
            height: io.of(170),
            weight: io.of(70)
        }),
        view => ReactDOM.render(view, document.getElementById('io'))
    ),
    1000
);

task.map(
    App(task)({
        height: tDelay(2000)(task.of(170)),
        weight: task.of(70)
    }),
    view => ReactDOM.render(view, document.getElementById('task'))
)();


const customArray: typeof array = {
    ...array,
    ap: (fab, fa) => fab.map((ab, i) => ab(fa[i]))
}

ReactDOM.render(
    App(customArray)({
        height: [170, 120],
        weight: [80, 55]
    }),
    document.getElementById('array')
)

declare module 'fp-ts/es6/HKT' {
    interface URItoKind<A> {
        Observable: Observable<A>
    }
}

const observable: Applicative1<'Observable'> = {
    URI: 'Observable',
    of: (a) => of(a),
    map: (fa, f) => fa.pipe(map(a => f(a))),
    ap: (fab, fa) => combineLatest([fab, fa]).pipe(map(([ab, a]) => ab(a))),
}

App(observable)({
    height: timer(0, 1000)
        .pipe(map(() => random(120, 200))),
    weight: timer(0, 1000).pipe(delay(500))
        .pipe(map(() => random(50, 120)))
}).subscribe(
    view => ReactDOM.render(view, document.getElementById('observable'))
);
