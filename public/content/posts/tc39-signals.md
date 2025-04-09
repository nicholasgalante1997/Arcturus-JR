---
slug: "/developers/blog/tc39-signals"
visible: true
title: "Implementing a tiny TC39 Signal API in Typescript in about ~200 SLOC using simple Graphs and Stacks."
description: "God, I'm fucking back. Nobody asked for this, so of course, I went ahead and tried to build the smallest possible implementation of the TC39 Proposed Signals API in Typescript using native JS APIs and data structures, with absolutely zero external dependencies."
media:
  - source: "/assets/doodles-adventurer.jpg"
    alt: "Me, as a Doodle, about to embark on an adventure through a valley, with several mountains in the background."
    aspectRatio: "16 / 16"
releaseDate: "03/18/2025"
estimatedReadingTime: "30 minutes"
author:
  - first_name: "Nick"
    last_name: "Galante"
    email: "rustycloud42@protonmail.com"
    github: "nicholasgalante1997"
    avatar: "/assets/headshot.jpg"
    nickname: "Cthu"
    id: '001'
category: Web Development
archCategory: SOFTWARE ENGINEERING
searchTerms:
  - Typescript
  - TC39 Proposal
  - Signals
genres:
  - Typescript
  - TC39 Proposal
  - Signals
---

_How could you be back, when you never left Nick?_

**I don't know or care. It's fine to ignore me sometimes. Let's get into it.**

## Signals and the TC39 Proposal 'proposal-signals'

If this article made you interested in Signals, you can read [the original TC39 proposal here](https://github.com/tc39/proposal-signals).

### What are signals?

Signals are a reactive coding paradigm that can be leveraged to handle updates to a system when internal dependencies of that system change, and you want to run side effects on a given dependencies updates.  

From the proposal:

>
> Signals are used in reactive programming to remove the need to manage updating in applications.
>
> A declarative programming model for updating based on changes to state.
>

### A Brief Aside

> The next two sections ("A Quick Example", "Important Notes on Signals") are copied directly from the proposal, you can [read them in source here](https://github.com/tc39/proposal-signals?tab=readme-ov-file#introducing-signals), and if you are familiar with the proposal, you can likely skip them altogether.

### A Quick Example (Directly "Borrowed" [read 'Stolen'] from the TC39 Signals Proposal)

> This entire section can be [read in source here](https://github.com/tc39/proposal-signals?tab=readme-ov-file#background-why-signals)

#### Vanilla JS Counter Example

Given a variable, counter, you want to render into the DOM whether the counter is even or odd. Whenever the counter changes, you want to update the DOM with the latest parity. In Vanilla JS, you might have something like this:

```js
let counter = 0;
const setCounter = (value) => {
  counter = value;
  render();
};

const isEven = () => (counter & 1) == 0;
const parity = () => isEven() ? "even" : "odd";
const render = () => element.innerText = parity();

// Simulate external updates to counter...
setInterval(() => setCounter(counter + 1), 1000);
```

This has a number of problems...

- The counter setup is noisy and boilerplate-heavy.
- The counter state is tightly coupled to the rendering system.
- If the counter changes but parity does not (e.g. counter goes from 2 to 4), then we do unnecessary computation of the parity and unnecessary rendering.
- What if another part of our UI just wants to render when the counter updates?
- What if another part of our UI is dependent on isEven or parity alone?

...

However, we're still stuck with the following problems:

- The render function, which is only dependent on parity must instead "know" that it actually needs to subscribe to counter.
- It isn't possible to update UI based on either isEven or parity alone, without directly interacting with counter.
- We've increased our boilerplate. Any time you are using something, it's not just a matter of calling a function or reading a variable, but instead subscribing and doing updates there. Managing unsubscription is also especially complicated.

#### Example - A Signals Counter

```js
const counter = new Signal.State(0);
const isEven = new Signal.Computed(() => (counter.get() & 1) == 0);
const parity = new Signal.Computed(() => isEven.get() ? "even" : "odd");

// A library or framework defines effects based on other Signal primitives
declare function effect(cb: () => void): (() => void);

effect(() => element.innerText = parity.get());

// Simulate external updates to counter...
setInterval(() => counter.set(counter.get() + 1), 1000);
```

There are a few things we can see right away:

- We've eliminated the noisy boilerplate around the counter variable from our previous example.
- There is a unified API to handle values, computations, and side effects.
- There's no circular reference problem or upside down dependencies between counter and render.
- There are no manual subscriptions, nor is there any need for bookkeeping.
- There is a means of controlling side-effect timing/scheduling.

### Important Notes on Signals

These are copied directly from the proposal, you can [read them in source here](https://github.com/tc39/proposal-signals?tab=readme-ov-file#introducing-signals)

#### Features of Signals

> - Automatic Dependency Tracking - A computed Signal automatically discovers any other Signals that it is dependent on, whether those Signals be simple values or other computations.
> - Lazy Evaluation - Computations are not eagerly evaluated when they are declared, nor are they immediately evaluated when their dependencies change. They are only evaluated when their value is explicitly requested.
> - Memoization - Computed Signals cache their last value so that computations that don't have changes in their dependencies do not need to be re-evaluated, no matter how many times they are accessed.

_Core Features for Implementations_

> - A Signal type which represents state, i.e. writable Signal. This is a value that others can read.
> - A computed/memo/derived Signal type, which depends on others and is lazily calculated and cached.
> - Computation is lazy, meaning computed Signals aren't calculated again by default when one of their dependencies changes, but rather only run if someone actually reads them.
> - Computation is "glitch-free", meaning no unnecessary calculations are ever performed. This implies that, when an application reads a computed Signal, there is a topological sorting of the potentially dirty parts of the graph to run, to eliminate any duplicates.
> - Computation is cached, meaning that if, after the last time a dependency changes, no dependencies have changed, then the computed Signal is not recalculated when accessed.
> - Custom comparisons are possible for computed Signals as well as state Signals, to note when further computed Signals which depend on them should be updated.
Reactions to the condition where a computed Signal has one of its dependencies (or nested dependencies) become "dirty" and change, meaning that the Signal's value might be outdated.
> - This reaction is meant to schedule more significant work to be performed later.
> - Effects are implemented in terms of these reactions, plus framework-level scheduling.
> - Computed signals need the ability to react to whether they are registered as a (nested) dependency of one of these reactions.
> - Enable JS frameworks to do their own scheduling. No Promise-style built-in forced-on scheduling.
> - Synchronous reactions are needed to enable scheduling later work based on framework logic.
> - Writes are synchronous and immediately take effect (a framework which batches writes can do that on top).
> - It is possible to separate checking whether an effect may be "dirty" from actually running the effect (enabling a two-stage effect scheduler).
> - Ability to read Signals without triggering dependencies to be recorded (untrack)
> - Enable composition of different codebases which use Signals/reactivity, e.g.,
> - Using multiple frameworks together as far as tracking/reactivity itself goes (modulo omissions, see below)
> - Framework-independent reactive data structures (e.g., recursively reactive store proxy, reactive Map and Set and Array, etc.)

## Workspace

Okay now that we've outlined the confines that we're working within, let's begin to implement our Signal API, and we'll do it in Typescript.

You're gonna see a lot of comments in the code, but if you take them out, you'll see this is under ~200 SLOC.

### Base Data Structures

So to be able to implement the Signal API in the method we're going to, we need to have a few core data structures, namely a directional graph and a stack. Both are fairly simple to implement in Typescript. If you're an eager beaver and you're wondering why you would need a graph and a stack, we need a way to be able to keep track of a Signal and it's relationships to other signals and effects, which makes sense to track in a graph data structure. We need the stack for managing an internal computation context stack, which will make sense later when we introduce Computed Signals.

### Base Data Structures

#### Setting up the Graph Structure

```ts

// index.ts

type Relationship<V> = {
  provider: V;
  dependent: V;
}

class Graph<V> {
  /** For storing Nodes and Edges */
  private adjacencyList: Map<V, Relationship<V>[]>;
  constructor() {
    this.adjacencyList = new Map();
  }

  /**
   * Adds a node to the graph
   * @param vertex The vertex (node) to be added to the graph
   * If the vertex already exists in the graph, no action is taken.
   */
  addVertex(vertex: V): void {
    if (this.adjacencyList.has(vertex)) return;
    this.adjacencyList.set(vertex, []);
  }

  /**
   * Removes a node from the graph
   * @param vertex The vertex (node) to be removed from the graph
   *  
   * If the vertex does not exist in the graph, no action is taken.
   * 
   * If the vertex exists in the graph, all edges connected to it are also removed.
   * */
  removeVertex(vertex: V): void {
    if (this.adjacencyList.has(vertex)) this.adjacencyList.delete(vertex);
    for (const [k, v] of this.adjacencyList.entries()) {
      this.adjacencyList.set(k, v.filter((r) => r.provider !== vertex && r.dependent !== vertex));
    }
  }

  /**
   * Adds an edge between two nodes to the graph
   * 
   * If either or neither node exists, they are inserted prior to the edge.
   * 
   * @param relationship The relationship (edge) to be added to the graph, 
   * which is a tuple of type Relationship<V> that expresses a relationship,
   * that one vertex maintains to another vertex within the graph.
   * */
  addEdge(relationship: Relationship<V>): void {
    Object.values(relationship).forEach((vertex) => {
      if (!this.adjacencyList.has(vertex)) this.addVertex(vertex);
    });

    const providingVertex = relationship.provider;
    const dependents = this.getEdges(providingVertex);

    this.adjacencyList.set(providingVertex, [...dependents, relationship]);
  }

  /**
   * Gets all edges connected to a node (vertex)
   * @param vertex The node (vertex) for which to retrieve connected edges
   * @returns An array of type Relationship<V>[] that represents all edges connected to the given vertex
   */
  getEdges(vertex: V): Relationship<V>[] {
    return this.adjacencyList.get(vertex) || [];
  }

  /**
   * Gets all nodes in the graph
   * @returns An array of type V[] that contains all vertices in the graph
   */
  getVertices(): V[] {
    return Array.from(this.adjacencyList.keys());
  }

  get size() {
    return this.adjacencyList.size;
  }
}

```

Okay cool, so this is a pretty minimal implementation for a directional Graph in Typescript. It could likely actually be smaller. We won't use `size`, and we likely also won't use `getVertices`. But it's a good start.

Implementing Stack will be even easier. Stacks are LIFO so this is about to be a super simple manner of pushing and popping.

#### Setting up the Stack Structure

```ts

// index.ts

// Above code...

class Stack<T> {
  private context: T[] = [];

  push(item: T) {
    this.context.push(item);
  }

  pop() {
    if (this.context.length === 0) return;
    const lastItem = this.context.at(-1);
    this.context = this.context.slice(
      0,
      this.context.indexOf(lastItem!)
    );
    return lastItem;
  }

  peek() {
    return this.context.at(-1);
  }

  get size() {
    return this.context.length;
  }
}
```

Now we have a Stack.

### Implementing our Signal Base Types

> Obviously you don't even actually need this. You can likely even reduce LOC if you don't setup an abstract base class here and just go headfirst into subclasses. But art isn't art because we all grab the red crayon and color the same thing.

```ts

// index.ts

// Above code...

export namespace ISignal {
  export interface IBaseSignal<T> {
    /**
     * Get the current state of the Signal, analogous to: value
     */
    get(): T;
  }

  export interface IState<T> extends IBaseSignal<T> {
    get(): T;
    set(value: T): void;
  }

  export interface IComputed<T> extends IBaseSignal<T> {
    get(): T;
  }

  export interface SignalOptions<T> {
    /**
     * Custom comparison function between old and new value. Default: Object.is.
     *
     * The signal is passed in as the this value for context.
     */
    equals?: (context: IBaseSignal<T>, t1: T, t2: T) => boolean;
  }
}

/**
 * A namespace for shared Signal utils
 * */
export namespace Signal {

  function getSignalId() {
    return Symbol('signal.keys.id');
  }

  /**
   * Base class for all Signals
   */
  abstract class BaseSignal<T> {
    /**
     * A unique identifier for each [Signal]
     */
    public readonly key: symbol;

    /**
     * Previous states that the Signal held,
     * We actually only ever need the last state
     */
    protected __lost_states__: T[] = [];

    /**
     * Map of dependents, and the value that this Signal held
     * when the dependent last requested it,
     * can be used to determine whether a Computed signal is stale
     */
    protected computedSubscriberMap = new Map<Computed<any>, T>();

    /**
     * Comparative function to determine equality of unknown type (T)
     * default is Object.is, but you are expected to provide a means of comparison
     */
    protected compare = (context: ISignal.IState<T> | ISignal.IComputed<T>, t1: T, t2: T) => Object.is(t1, t2);

    constructor(options?: ISignal.SignalOptions<T>) {
      this.key = getSignalId();
      if (options?.equals) {
        this.compare = options.equals;
      }
    }

    public abstract get(): T;
  }

  export class State<T> extends BaseSignal<T> implements ISignal.IState<T> {
   /** todo!() */
  }

  export class Computed<T> extends BaseSignal<T> implements ISignal.IComputed<T> {
    /** todo!() */
  }

  export class Effect {
    /** todo!() */
  }

  export function createEffect(effect: () => void) {
    /** todo!() */
  }
}
```

Let's walk through a few things that we've set up here. 