class Memoizer<T> {
    recentCount: number;
    recentVals: {[input: string]: T};
    olderVals: {[input: string]: T};
    run: (x: string) => T;
    constructor(nonMemoizedFunction: ((x: string, recurse: ((x: string) => T)) => T)) {
        this.recentCount = 0;
        this.recentVals = {};
        this.olderVals = {};
        this.run = (x: string) => {
            const foundRecentVal = this.recentVals[x];
            const foundOlderVal = this.olderVals[x];
            if (foundRecentVal !== undefined) {
                console.log('found recent', x, foundRecentVal);
                return foundRecentVal;
            } else if (foundOlderVal !== undefined) {
                console.log('found old', x, foundOlderVal);
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
            console.log('doing');
            this.olderVals = this.recentVals;
            this.recentVals = {};
            this.recentCount = 0;
        }
    }
}

const fibonacci = (x: string, recurse: ((x: string) => number)) => {
    const num = parseInt(x);
    if (num === NaN || !num || num < 0) { return 0; }
    if (num === 1) { return 1; }
    return (recurse(`${num - 1}`) + recurse(`${num - 2}`));
}

const memoizedFib = new Memoizer(fibonacci);
console.log(memoizedFib.run(`1`));
console.log(memoizedFib.run(`2`));
console.log(memoizedFib.run(`4`));
console.log(memoizedFib.run(`6`));
console.log(memoizedFib.run(`10`));
console.log(memoizedFib.run(`20`));
console.log(memoizedFib.run(`30`));
console.log(memoizedFib.run(`300`));
console.log(memoizedFib.run(`3000`));
