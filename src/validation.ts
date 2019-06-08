import {map, left, right, Either, flatten} from 'fp-ts/lib/Either';

const fetchUser = () => right('user1');
const fail = () => left('fail');
const fetchPosts = (user: string) => right(user.length);
const toArray = (length: number) => right(new Array(length));

function do_(fun: () => IterableIterator<any>): void {
    const iter = fun();

    const next = (v?: any): any => {
        const {value, done} = iter.next(v);
        if (done) return right(value);
        return flatten(map(next)(value));
    };
    
    return next();
}

console.log('result', do_(function* () {
    const user = yield fetchUser();
    console.log({user});
    const result = yield fetchPosts(user);

    console.log({result});
    const arr =  yield toArray(result);

    return yield fail();
}))