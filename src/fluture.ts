import {Future, parallel, promise} from 'fluture';

const log = (...a: unknown[]) => (...b: unknown[]) => console.log(...a, ...b);

(async () => {
  const after =
    (duration: number) => <T>(value: T) =>
      Future<never, T>((_, res) => {
        const timeoutID =
          setTimeout(res, duration, value);

        return () =>
          clearTimeout(timeoutID);
      });

  const rejectAfter =
    (duration: number) => <E>(err: E) =>
      Future<E, never>(rej => {
        const timeoutID =
          setTimeout(rej, duration, err);

        return () =>
          clearTimeout(timeoutID);
      });

  await promise(
    parallel<string, string>(Infinity)([
      after(300)('300'),
      rejectAfter(200)('200'),
      after(100)('100'),
      rejectAfter(400)('400')
    ])
  ).then(
    log('resolution'),
    log('rejection')
  );
})();
