function setupFixtures(...args) {
  return async function(t) {
    const test = args.pop();
    const fixtures = args;
    const ctx = {
      _teardown: []
    };

    try {
      await runSerial(fixtures, ctx);
      await test(t, ctx);
      await teardown(ctx);
    } catch(e) {
      console.log(e)
      await teardown(ctx);
      throw e;
    }
  }
}

async function teardown(ctx) {
  ctx._teardown.reverse();
  await runSerial(ctx._teardown, ctx);
}

async function runSerial(fixtures, ctx) {
  await fixtures.reduce(async (previousPromise, nextAsyncFunction) => {
    await previousPromise;
    return nextAsyncFunction(ctx);
  }, Promise.resolve());
}

export {
  setupFixtures as default
}