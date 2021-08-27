import test from 'ava';
import { sortBy as _sortBy, get } from 'lodash/fp'
import {
    sortBy,
    numberCompare,
    stringCompare,
    booleanCompare,
    inverse,
    contramap,
    concat,
    empty,
    Compare
} from '../../src/data/compare';

test('Compare<number>', t => {
    t.is(numberCompare(0, 1), -1);
    t.is(numberCompare(3, 1), 1);
    t.is(numberCompare(0, -0), 0);

    t.deepEqual(sortBy(numberCompare)([3, 1, 2, 0]), [0, 1, 2, 3])

    t.is(inverse(numberCompare)(0, 1), 1);
    t.is(inverse(numberCompare)(3, 1), -1);
    t.is(inverse(numberCompare)(0, -0), 0);

    t.deepEqual(sortBy(inverse(numberCompare))([3, 1, 2, 0]), [3, 2, 1, 0])
});
test('Compare<string>', t => {
    t.is(stringCompare('aa', 'bb'), -1);
    t.is(stringCompare('cc', 'aa'), 1);
    t.is(stringCompare('aa', 'aa'), 0);

    t.deepEqual(sortBy(stringCompare)(['cc', 'aa', 'bb', 'a_']), ['a_', 'aa', 'bb', 'cc'])

    t.is(inverse(stringCompare)('aa', 'bb'), 1);
    t.is(inverse(stringCompare)('cc', 'aa'), -1);
    t.is(inverse(stringCompare)('aa', 'aa'), 0);

    t.deepEqual(sortBy(inverse(stringCompare))(['cc', 'aa', 'bb', 'a_']), ['cc', 'bb', 'aa', 'a_'])
});
test('Compare<boolean>', t => {
    t.is(booleanCompare(false, true), -1);
    t.is(booleanCompare(true, false), 1);
    t.is(booleanCompare(true, true), 0);

    t.deepEqual(sortBy(booleanCompare)([true, false, true]), [false, true, true])

    t.is(inverse(booleanCompare)(false, true), 1);
    t.is(inverse(booleanCompare)(true, false), -1);
    t.is(inverse(booleanCompare)(true, true), 0);

    t.deepEqual(sortBy(inverse(booleanCompare))([true, false, true]), [true, true, false])
});


test('Compare<Rock|Paper|Scissors>', t => {
    type RockPaperScissors = 'Rock' | 'Paper' | 'Scissors';

    const rockPaperScissorsCompare: Compare<RockPaperScissors> = (a, b) => {
        switch (a) {
            case 'Rock':
                switch (b) {
                    case 'Rock': return 0;
                    case 'Paper': return -1;
                    case 'Scissors': return 1;
                }
            case 'Paper':
                switch (b) {
                    case 'Rock': return 1;
                    case 'Paper': return 0;
                    case 'Scissors': return -1;
                }
            case 'Scissors':
                switch (b) {
                    case 'Rock': return -1;
                    case 'Paper': return 1;
                    case 'Scissors': return 0;
                }
        }
    }

    t.is(rockPaperScissorsCompare('Rock', 'Paper'), -1);
    t.is(rockPaperScissorsCompare('Scissors', 'Paper'), 1);
    t.is(rockPaperScissorsCompare('Paper', 'Paper'), 0);

    t.deepEqual(sortBy(rockPaperScissorsCompare)(['Scissors', 'Paper', 'Rock']), ['Rock', 'Paper', 'Scissors'])
    t.deepEqual(sortBy(rockPaperScissorsCompare)(['Scissors', 'Rock', 'Paper']), ['Scissors', 'Rock', 'Paper'])
})

test('Constravarint', t => {
    const lengthCompare = contramap<number, string>(numberCompare, s => s.length);

    t.is(lengthCompare('b', 'aa'), -1);
    t.is(lengthCompare('aa', 'c'), 1);
    t.is(lengthCompare('aa', 'aa'), 0);

    t.deepEqual(sortBy(lengthCompare)(['cc', 'aaa', '', 'b']), ['', 'b', 'cc', 'aaa'])
})

test('Semigroup', t => {
    const lengthCompare = contramap<number, string>(numberCompare, s => s.length);

    const lengthThenAlphaCompare = concat(lengthCompare, stringCompare);

    t.is(lengthThenAlphaCompare('', 'a'), -1);
    t.is(lengthThenAlphaCompare('cc', 'a'), 1);
    t.is(lengthThenAlphaCompare('aa', 'aa'), 0);

    t.deepEqual(sortBy(lengthThenAlphaCompare)(['cc', 'aa', '', 'b']), ['', 'b', 'aa', 'cc'])
})

test('Monoid', t => {
    const lengthCompare = contramap<number, string>(numberCompare, s => s.length);

    const lengthThenAlphaCompare = [lengthCompare, stringCompare].reduce(concat, empty);

    t.is(lengthThenAlphaCompare('', 'a'), -1);
    t.is(lengthThenAlphaCompare('cc', 'a'), 1);
    t.is(lengthThenAlphaCompare('aa', 'aa'), 0);

    t.deepEqual(sortBy(lengthThenAlphaCompare)(['cc', 'aa', '', 'b']), ['', 'b', 'aa', 'cc'])
})

test('Progression', async t => {
    type Progression = {
        id: number;
        level: 'base' | 'advanced' | 'coach';
        createdAt: string;
    };

    const LEVEL = {
        base: 1,
        advanced: 2,
        coach: 3
    }

    const progressions: Array<Progression> = [
        { "id": 8, "level": "base", "createdAt": "2019-08-08T12:42:56" },
        { "id": 6, "level": "advanced", "createdAt": "2019-09-08T12:42:56" },
        { "id": 2, "level": "advanced", "createdAt": "2019-08-08T12:42:57" },
        { "id": 7, "level": "base", "createdAt": "2019-08-08T12:42:56" },
        { "id": 3, "level": "coach", "createdAt": "2019-08-08T12:42:58" },
        { "id": 9, "level": "base", "createdAt": "2019-08-08T12:42:56" },
    ];

    type Aggregation = {
        level: number,
        createdAt: number,
        progression: Progression
    };
    const aggregations: Array<Aggregation> = await Promise.all(progressions.map((progression): { level: number, createdAt: number, progression: Progression } => {
        return {
            level: LEVEL[progression.level],
            createdAt: new Date(progression.createdAt).getTime(),
            progression
        };
    }));

    t.deepEqual(
        sortBy<Aggregation>(
            concat(
                contramap(numberCompare, _ => _.level),
                inverse(
                    contramap(numberCompare, _ => _.createdAt)
                )
            )
        )(aggregations),
        _sortBy(['level', '-createdAt'], aggregations)
    );
});
