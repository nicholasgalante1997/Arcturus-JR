export const pipeline =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);
