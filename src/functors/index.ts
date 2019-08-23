import {deepEqual, ok} from 'assert';
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
function isAdult( u: User ) {
    return u.age >= 18;
};

deepEqual(
    Maybe.map(
        isAdult,
        Maybe.just(user)
    ),
    Maybe.just(isAdult(user)),
    'Maybe is not a functor'
);
deepEqual(
    Either.map(
        isAdult,
        Either.right(user)
    ),
    Either.right(isAdult(user)),
    'Either is not a functor'
);
deepEqual(
    Tree.map(
        isAdult,
        Tree.node(user)
    ),
    Tree.node(isAdult(user)),
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
        Identity.identity(user)
    ),
    Identity.identity(isAdult(user)),
    'Identity is not a functor'
);
deepEqual(
    Lazy.force(
        Lazy.map(
            isAdult,
            Lazy.lazy(user)
        )
    ),
    Lazy.force(
        Lazy.lazy(isAdult(user))
    ),
    'Lazy is not a functor'
);
deepEqual(
    await Async.force(
        Async.map(
            isAdult,
            Async.async(user)
        )
    ),
    await Async.force(
        Async.async(isAdult(user))
    ),
    'Async is not a functor'
);
    console.log('✅');
})()