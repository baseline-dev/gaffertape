# Gaffertape

Gaffertape helps you with setup and teardown of stuff for your tape tests.
Think of db entries, or a local server for testing API endpoints.

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

test('something', setupFixtures(createUser({ name: 'anna' }), async (t) => {
  t.equal(ctx.user.name, 'anna');
});

```