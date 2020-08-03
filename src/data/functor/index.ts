import { deepEqual, ok } from 'assert';
import * as Array from './array';
import * as Promise_ from './promise';
import * as Maybe from './maybe';
import * as Either from './either';
import * as Tree from './tree';
import * as Reactive from './reactive';
import * as Identity from './identity';
import * as Lazy from './lazy';
import * as Async from './async';

(async () => {
    type User = { age: Number };

    const user = { age: 20 };
    function isAdult(u: User) {
        return u.age >= 18;
    };

    deepEqual(
        Array.map(
            isAdult,
            Array.of(user)
        ),
        Array.of(isAdult(user)),
        'Promise is not a functor'
    );
    deepEqual(
        await Promise_.map(
            isAdult,
            Promise_.of(user)
        ),
        await Promise_.of(isAdult(user)),
        'Promise is not a functor'
    );
    deepEqual(
        Maybe.map(
            isAdult,
            Maybe.of(user)
        ),
        Maybe.of(isAdult(user)),
        'Maybe is not a functor'
    );
    deepEqual(
        Either.map(
            isAdult,
            Either.of(user)
        ),
        Either.of(isAdult(user)),
        'Either is not a functor'
    );
    deepEqual(
        Tree.map(
            isAdult,
            Tree.of(user)
        ),
        Tree.of(isAdult(user)),
        'Tree is not a functor'
    );
    deepEqual(
        await Reactive.map(
            isAdult,
            Reactive.of(user)
        ).toPromise(),
        await Reactive.of(isAdult(user)).toPromise(),
        'Reactive is not a functor'
    );
    deepEqual(
        Identity.map(
            isAdult,
            Identity.of(user)
        ),
        Identity.of(isAdult(user)),
        'Identity is not a functor'
    );
    deepEqual(
        Lazy.force(
            Lazy.map(
                isAdult,
                Lazy.of(user)
            )
        ),
        Lazy.force(
            Lazy.of(isAdult(user))
        ),
        'Lazy is not a functor'
    );
    deepEqual(
        await Async.force(
            Async.map(
                isAdult,
                Async.of(user)
            )
        ),
        await Async.force(
            Async.of(isAdult(user))
        ),
        'Async is not a functor'
    );
    console.log('✅');
})()
