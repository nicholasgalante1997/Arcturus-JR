class FibonacciRange {

    #sequenceOriginal = [0, 1];

    getSequenceBounded(start = 0, end = 22) {
        const sequence = [...this.#sequenceOriginal];
        let current = 1;
        while (current <= end) {
            sequence.push(current);
            current += sequence[sequence.length - 2];
        }
        return sequence.filter(num => num >= start);
    }

}

export default FibonacciRange;