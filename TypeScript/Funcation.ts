function sum(a: number, b: number): number {
    return a + b;
}

const yetAnotherSum: (a: number, b: number) => number = sum;
const onePlusOne: () => number = () => 2;
const arrowSum: (a: number, b: number) => number = (a, b) => (a + b);

console.log(sum(10, 20));
console.log(yetAnotherSum(10, 20));
console.log(onePlusOne());
console.log(arrowSum(10, 20));