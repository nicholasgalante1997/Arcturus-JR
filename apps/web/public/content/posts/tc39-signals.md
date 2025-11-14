---
slug: "/developers/blog/tc39-signals"
visible: true
title: "Implementing a tiny TC39 Signal API in Typescript in about ~200 SLOC using simple Graphs and Stacks."
---

## Stage Setting

You have a browser based web application. Within it, you manage some state, and when that state changes, you would like to trigger a corresponding UI update.

```javascript
let num = 0;
let text = `Your number is ${num}`;
let element = document.getElementById('counter');
let incrementButton = document.getElementById('increment');
let decrementButton = document.getElementById('decrement');

incrementButton.addEventListener('click', increment);
decrementButton.addEventListener('click', decrement);

function increment() {
  num++;
  updateText();
  syncUI();
}

function decrement() {
  num--;
  updateText();
  syncUI();
}

function updateText() {
  text = `Your number is ${num}`;
}

function syncUI() {
  element.innerHTML = text;
}
```

Objectively, this blows.

There's a number of unideal code smells emerging here. We have a tight coupling between `num` and `text` and when `text` changes, we know we want to update the UI, which is another tight coupling. We need to now couple the action of incrementing and decrementing, with the actions of updating the text (which it should not care about) and also with syncing the UI. It's also a ton of boilerplate code.

We can improve this code, using the tc39 Signals spec.

Let's take a look at what this code becomes with signals:

```javascript
const num = new Signal.State(0);
const text = new Signal.Computed(() => `Your number is ${num.get()}`);
const element = document.getElementById('counter');
const incrementButton = document.getElementById('increment');
const decrementButton = document.getElementById('decrement');

incrementButton.addEventListener('click', () => num.set(num.get() + 1));
decrementButton.addEventListener('click', () => num.set(num.get() - 1));

Signal.createEffect(() => {
  element.innerHTML = text.get();
});
```

Yeah, that's better! Let's now try and understand why.

1. The increment and decrement functions have returned to managing the `num` state, and not the UI.
2. We can express dependencies between code more clearly
   1. `text` relies on `num`
   2. `element` relies on `text`
3. The graph is now implicit. When num changes, text changes. When text changes, the side effect is run and element has its `innerHTML` property updated to remain in sync with `text`.
4. There is no need to explicitly couple the UI and the state through closure functions.

So how can we achieve this?  

## TC39 Signals Spec

Before progressing further...

If you have not read the spec in full, and you have an interest in doing so, it is linked [here](https://github.com/tc39/proposal-signals). for your convenience. It is currently in stage 1.

## So what are our options?
---

<br />

### Community Options

If you would like to use something out of the box, (which I would recommend over the solution we'll implement together today), then I like the [alien-signals](https://www.npmjs.com/package/alien-signals) library, which does a really great job and I'm partial to it because I believe in aliens.

### DIY

Let's go ahead and build a minimally viable implementation ourselves.

<br />

---

<br />

## Implementing Signals
