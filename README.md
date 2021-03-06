# Gaffertape

Gaffertape helps you with setup and teardown of stuff for your [tape tests](https://github.com/substack/tape).
Think of db entries, or a local server for testing API endpoints.
Inspiration from the excellent [@mvhenten](https://github.com/mvhenten).

## Install

```
npm install @baseline-dev/gaffertape
```

## Usage

```javascript
import setupFixtures from 'gaffertape'
import test from 'tape';

function createUser(props) {
  return async (ctx) => {
    const user = {
      name: props.name
    }; // Create user for instance in your db.
        
    ctx._teardown.push(async () => {
      // Remove your user from your db.
    });
        
    ctx.user = user;
  }
}

test('something', setupFixtures(createUser({ name: 'anna' }), async (t, ctx) => {
  t.equal(ctx.user.name, 'anna');
});
```

You can call `setupFixtures` with a bunch of async functions which will be ran serially.
Make sure that your last function is the actual test you want to run. 

Each function will have access to the ctx object where you can store temporary state, needed for your tests.
After the test run, `gaffertape` iterates over a `_teardown` array on the `ctx` object. 
If you need to clean up, push an async function onto the `_teardown` array.
