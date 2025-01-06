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
console.log("-------------------------------------")

function fetchVideo(
    url: string,
    success: () => void,
    failure: () => void
): void {
    url === "https://www.youtube.com/watch?v=1234" ? success() : failure();
}

fetchVideo(
    "https://www.youtube.com/watch?v=1234",
    () => console.log("Success"),
    () => console.log("Failure")
);