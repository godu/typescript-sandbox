import test, { Macro } from 'ava';
import { parse, variable, Variable, abstraction } from '../src/lambda-calculus';
import { some, none } from 'fp-ts/lib/Option';

const parseMacro: Macro<[string, Variable?, string?]> = (t, input, expected, rest = '') => {
    const actual = parse(input);
    if (expected)
        t.deepEqual(actual, some([expected, rest]));
    else
        t.deepEqual(actual, none);
}
parseMacro.title = (_providedTitle, input, expected) =>
    expected
        ? `parse(${input}) === Variable(${expected.name})`
        : `parse(${input}) === None`

test(parseMacro, 'x', variable('x'))
test(parseMacro, 'x1x2', variable('x1'), 'x2')
test(parseMacro, 'x10', variable('x10'))
test(parseMacro, '')
