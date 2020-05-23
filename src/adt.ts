type Shape = 'Circle' | 'Triangle'
           | 'Diamond' | 'Pentagon';

type Digit = 0 | 1 | 2 | 3 | 4
           | 5 | 6 | 7 | 8 | 9;

type Void = never;
type Unit = [];

// type Null = null;
// type Undefined = undefined;


const circle: Shape = 'Circle';

// Type '"Cross"' is not assignable to type 'Shape'.
// const cross: Shape = 'Cross';


//const void: Void = ???;

const unit: Unit = [];


type Null = null;
type Undefined = undefined;

function toNull(_unit: Unit): Null {
  return null;
}
function toUnit(_null: Null): Unit {
  return [];
}

toNull(toUnit(null)) === null
toUnit(toNull(unit)) === unit

// type Sum<A, B> = A | B;

// type ShapeOrDigit = Sum<Shape, Digit>;
// type ShapeOrDigit = "Circle" | "Triangle"
//                   | "Diamond" | "Pentagon"
//                   | 0 | 1 | 2 | 3 | 4
                  // | 5 | 6 | 7 | 8 | 9;


type Sum<A, B> = {type: 'left', value: A}
               | {type: 'right', value: B};

type ShapeOrShape = Sum<Shape, Shape>;


type Bool = Sum<Unit, Unit>;


type Product<A, B> = [A, B];
// [A, B] =iso= {a: A, b: B}

type ShapeAndDigit = Product<Shape, Digit>

type ShapeAndDigit_ = [Shape, Digit]
type ShapeAndDigit__ = { shape: Shape, digit: Digit }

type ShapeOrVoid = Product<Shape, Void>
type ShapeOrVoid_ = Void

type Power<A, B> = (a: A) => B

type ShapeToVoid = Power<Shape, Void>
type ShapeToVoid_ = Void
