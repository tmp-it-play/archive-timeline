enum ShapeKind {
    Circle,
    Triangle = 3,
    Square
}

type Circle = {
    kind: ShapeKind.Circle;
    radius: number;
}

type Triangle = {
    kind: ShapeKind.Triangle;
    maxAngle: number;
}
type Square = {
    kind: ShapeKind.Square;
    maxLength: number;
}
type Shape = Circle | Triangle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case ShapeKind.Circle:
            return Math.PI * shape.radius ** 2;
        case ShapeKind.Triangle:
            return shape.maxAngle ** 2;
        case ShapeKind.Square:
            return shape.maxLength ** 2;
    }
}

const circle: Circle = {
    kind: ShapeKind.Circle,
    radius: 10
}

const triangle: Triangle = {
    kind: ShapeKind.Triangle,
    maxAngle: 90
}

const square: Square = {
    kind: ShapeKind.Square,
    maxLength: 10
}

console.log(getArea(circle)); // 314.1592653589793
console.log(getArea(triangle)); // 8100
console.log(getArea(square)); // 100