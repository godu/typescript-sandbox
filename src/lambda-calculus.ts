import { Option, none, some } from 'fp-ts/lib/Option';

/**
 * LAMBDA CALCULUS
 */

// Variables : x, y, x1, y1, f, g...

export type Variable = {
    readonly type: 'variable';
    readonly name: string;
}
export function isVariable(x: Expression): x is Variable {
    return x.type === 'variable';
}
export function variable(name: Variable['name']): Variable {
    return {
        type: 'variable',
        name
    };
}

// Expression
// e ::= λx.e|e1e2|x

export type Expression =
    | Variable
    | Abstraction
    | Application;

// λ-terme
// λx.e

// Si e est un λ-terme
// alors λx.e est un λ-terme
// *abstraction*

export type Abstraction = {
    readonly type: "abstraction";
    readonly variable: Variable;
    readonly expression: Expression;
}
export function isAbstraction(x: Expression): x is Abstraction {
    return x.type === 'abstraction';
}
export function abstraction(variable: Abstraction['variable'], expression: Abstraction['expression']): Abstraction {
    return {
        type: 'abstraction',
        variable,
        expression
    };
}

// Si e1 et e2 sont des λ-termes
// alors e1e2 est un λ-terme
// *application*

export type Application = {
    readonly type: 'application';
    readonly function_: Expression;
    readonly argument_: Expression;
}
export function isApplication(x: Expression): x is Application {
    return x.type === 'application';
}
export function application(function_: Application['function_'], argument_: Application['argument_']): Application {
    return {
        type: 'application',
        function_,
        argument_
    }
}

// I :== λx.x
export const I = application(
    variable('x'),
    variable('x')
);

// K :== λx.λy.x
export const K = application(
    variable('x'),
    application(
        variable('y'),
        variable('x')
    )
);

// Δ :== λx.xx
export const Δ = application(
    variable('x'),
    application(
        variable('x'),
        variable('x')
    )
);

// S :== λx.λy.λz.xz(yz)

const VARIABLE_NAME = /^([a-zA-Z][0-9]*)/;
export function parse(input: string): Option<[Variable, string]> {


    const variableMatch = VARIABLE_NAME.exec(input);
    if (variableMatch !== null && variableMatch[0]) {
        const variableName = variableMatch[0];
        return some([
            variable(variableName),
            input.slice(variableName.length)
        ]);
    }

    return none
}

