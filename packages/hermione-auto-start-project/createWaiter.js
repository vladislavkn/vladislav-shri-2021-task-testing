function createWaiter() {
  let resolveFn;
  const promise = new Promise((resolve) => (resolveFn = resolve));
  return { resolve: resolveFn, waiter: promise };
}

module.exports = createWaiter;
