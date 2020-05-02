function setupFixtures(...args) {
  return async function(t) {
    const test = args.pop();
    const fixtures = args;
    const ctx = {
      _teardown: []
    };

    try {
      let increasedPlan;
      await runSerial(fixtures, ctx);

      // We are increasing the plan count when plan is called.
      // This so we can teardown asyn after.
      t.on('plan', async () => {
        t._plan++;
        increasedPlan = true;
      })

      await test(t, ctx);

      await teardown(ctx);
      if (increasedPlan) {
        t._plan--;
        t.end();
      }
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