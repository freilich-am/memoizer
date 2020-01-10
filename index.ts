class Memoizer<T> {
    private recentCount: number;
    private recentVals: {[input: string]: T};
    private olderVals: {[input: string]: T};
    run: (x: string) => T;
    constructor(nonMemoizedFunction: (x: string, recurse: (x: string) => T) => T) {
        this.recentCount = 0;
        this.recentVals = {};
        this.olderVals = {};
        this.run = (x: string) => {
            const foundRecentVal = this.recentVals[x];
            const foundOlderVal = this.olderVals[x];
            if (foundRecentVal !== undefined) {
                return foundRecentVal;
            } else if (foundOlderVal !== undefined) {
                this.recentVals[x] = foundOlderVal;
                this.recentCount++;
                this.checkOlderValues();
                return foundOlderVal;
            } else {
                let valToReturn = nonMemoizedFunction(x, this.run);
                this.recentCount++;
                this.recentVals[x] = valToReturn;
                this.checkOlderValues();
                return valToReturn
            }
        }
    }

    checkOlderValues() {
        if (this.recentCount >= 100) {
            this.olderVals = this.recentVals;
            this.recentVals = {};
            this.recentCount = 0;
        }
    }
}

const fibonacci = (x: string, recurse: ((x: string) => number)): number => {
    const num = parseInt(x);
    if (num === NaN || !num || num < 0) { return 0; }
    if (num === 1) { return 1; }
    return (recurse(`${num - 1}`) + recurse(`${num - 2}`));
}

const memoizedFib = new Memoizer(fibonacci);

// Not recursing with a memoized version messes this up and makes it slow
// const fibonacci2 = (x: string): number => {
//     console.log(x, 'hey');
//     const num = parseInt(x);
//     if (num === NaN || !num || num < 0) { return 0; }
//     if (num === 1) { return 1; }
//     return (fibonacci2(`${num - 1}`) + fibonacci2(`${num - 2}`));
// }

// console.log(memoizedFib.run(`1`));
// console.log(memoizedFib.run(`2`));
// console.log(memoizedFib.run(`4`));
// console.log(memoizedFib.run(`6`));
// console.log(memoizedFib.run(`10`));
// console.log(memoizedFib.run(`20`));
// console.log(memoizedFib.run(`30`));
// console.log(memoizedFib.run(`300`));
// console.log(memoizedFib.run(`3000`));

// const memoizedFib2 = new Memoizer(fibonacci2);
// console.log(memoizedFib2.run(`1`));
// console.log(memoizedFib2.run(`2`));
// console.log(memoizedFib2.run(`4`));
// console.log(memoizedFib2.run(`6`));
// console.log(memoizedFib2.run(`10`));
// console.log(memoizedFib2.run(`20`));
// console.log(memoizedFib2.run(`30`));
// console.log(memoizedFib2.run(`300`));
// console.log(memoizedFib2.run(`3000`));
