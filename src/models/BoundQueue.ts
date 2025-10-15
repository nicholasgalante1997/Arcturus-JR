class BoundQueue<T> {
  private queue: T[] = [];
  private bound = Infinity;
  constructor(initial?: T[], size: number = 25000) {
    this.bound = size;
    if (initial) {
      if (initial.length > this.bound) {
        this.queue = initial.slice(0, this.bound);
      } else {
        this.queue = initial;
      }
    }
  }

  push(item: T) {
    if (this.queue.length === this.bound) {
      this.queue = [...this.queue.slice(1, this.bound), item];
    } else {
      this.queue.push(item);
    }
  }

  pop(): T | null {
    if (this.queue.length === 0) return null;
    const item = this.queue.at(0)!;
    this.queue = this.queue.slice(1, this.bound);
    return item;
  }

  peek() {
    return this.queue.at(0);
  }
}

export default BoundQueue;