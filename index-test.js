import test from 'tape';
import setupFixtures from './index';

test('setupFixtures returns function', (t) => {
  const fixtures = setupFixtures();
  t.assert(typeof fixtures === 'function');
  t.end();
});

test('setupFixtures: setup, teardown and ctx setting', async (t) => {
  t.plan(8);

  let counter = 0;
  function testFixtureOne(props) {
    return async (ctx) => {
      counter++;
      t.equal(counter, 1);
      const testObjectOne = props;
      ctx._teardown.push(async () => {
        counter--;
        t.equal(counter, 0);
        delete ctx.testObjectOne;
      });
      ctx.testObjectOne = testObjectOne;
    }
  }

  function testFixtureTwo(props) {
    return async (ctx) => {
      counter++;
      t.equal(counter, 2);
      const testObjectTwo = props;
      ctx._teardown.push(async () => {
        counter--;
        t.equal(counter, 1);
        delete ctx.testObjectTwo;
      });
      ctx.testObjectTwo = testObjectTwo;
    }
  }

  let ctx;
  const fixtures = setupFixtures(testFixtureOne({id:1}), testFixtureTwo({id:2}), (_t, _ctx) => {
    ctx = _ctx;
    t.equal(ctx.testObjectOne.id, 1);
    t.equal(ctx.testObjectTwo.id, 2);
  });

  await fixtures();

  t.notOk(ctx.testObjectOne);
  t.notOk(ctx.testObjectTwo);
});