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

const gen =  function* (): {
    next<T>(value: T)
} {
    const user: string = yield fetchUser();
    console.log({user});
    const result: number = yield fetchPosts(user);

    const arr: any[] =  yield toArray(result);

    return yield fail();
}

console.log('result', do_(gen))