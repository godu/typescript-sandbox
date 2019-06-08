import { Observable, merge } from 'rxjs';

const log = (...a: unknown[]) => (...b: unknown[]) => console.log(...a, ...b);

(async () => {
  const after =
    (duration: number) => <T>(value: T) =>
      new Observable<T>((subscriber) => {
        const timeoutID = setTimeout(() => {
          subscriber.next(value);
          subscriber.complete();
        }, duration);

        return () =>
          clearTimeout(timeoutID);
    });

  const rejectAfter =
    (duration: number) => <T>(err: unknown): Observable<T> =>
      new Observable<T>((subscriber) => {
        const timeoutID = setTimeout(() => {
          subscriber.error(err);
          subscriber.complete();
        }, duration);

        return () =>
          clearTimeout(timeoutID);
      });

  await merge(
    after(300)('300'),
    rejectAfter(200)<string>('200'),
    after(100)('100'),
    rejectAfter(400)<string>('400'),
    Infinity
  ).toPromise().then(
    log('resolution'),
    log('rejection')
  );
})();
