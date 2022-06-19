
import React from 'react';
import { createRoot } from 'react-dom/client';
import { curry } from 'ramda';
import { Kind, URIS } from 'fp-ts/es6/HKT';
import { Applicative1 } from 'fp-ts/es6/Applicative';
import { identity } from 'fp-ts/es6/Identity';
import { option } from 'fp-ts/es6/Option';
import { io } from 'fp-ts/es6/IO';
import { task, delay as tDelay } from 'fp-ts/es6/Task';
import { array } from 'fp-ts/es6/Array';
import { of, Observable, combineLatest, timer } from 'rxjs';
import { map, delay } from 'rxjs/operators';

const random = curry((min, max) => {
    let range = max - min;
    let random = Math.random() * range + min;
    return Math.floor(random);
  });

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


const identityContainer = document.getElementById('identity');
if (!identityContainer) throw new TypeError('Identity container is not found');
const identityRoot = createRoot(identityContainer);

identity.map(
    App(identity)({
        height: identity.of(170),
        weight: identity.of(70)
    }),
    view => identityRoot.render(view)
);

const optionContainer = document.getElementById('option');
if (!optionContainer) throw new TypeError('Option container is not found');
const optionRoot = createRoot(optionContainer);

option.map(
    App(option)({
        height: option.of(170),
        weight: option.of(70)
    }),
    view => optionRoot.render(view)
);

const ioContainer = document.getElementById('io');
if (!ioContainer) throw new TypeError('Io container is not found');
const ioRoot = createRoot(ioContainer);

setTimeout(
    io.map(
        App(io)({
            height: io.of(170),
            weight: io.of(70)
        }),
        view => ioRoot.render(view)
    ),
    1000
);

const taskContainer = document.getElementById('task');
if (!taskContainer) throw new TypeError('Task container is not found');
const taskRoot = createRoot(taskContainer);

task.map(
    App(task)({
        height: tDelay(2000)(task.of(170)),
        weight: task.of(70)
    }),
    view => taskRoot.render(view)
)();


const customArray: typeof array = {
    ...array,
    ap: (fab, fa) => fab.map((ab, i) => ab(fa[i]))
}

const arrayContainer = document.getElementById('array');
if (!arrayContainer) throw new TypeError('Array container is not found');
const arrayRoot = createRoot(arrayContainer);

arrayRoot.render(
    App(customArray)({
        height: [170, 120],
        weight: [80, 55]
    })
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

const observableContainer = document.getElementById('observable');
if (!observableContainer) throw new TypeError('Observable container is not found');
const observableRoot = createRoot(observableContainer);

App(observable)({
    height: timer(0, 1000)
        .pipe(map(() => random(120, 200))),
    weight: timer(0, 1000).pipe(delay(500))
        .pipe(map(() => random(50, 120)))
}).subscribe(
    view => observableRoot.render(view)
);
