get-lookup
==========

JS helper for object deeply nested properties lookup. Much like
[`lodash.get`](https://www.npmjs.com/package/lodash.get), but with some
additional useful features.

[![build status](https://img.shields.io/travis/akuzko/get-lookup/master.svg?style=flat-square)](https://travis-ci.org/akuzko/get-lookup)

## Installation

```
npm install --save get-lookup
```

## Usage

Considering we have following object:

```js
const obj = {
  foo: {
    bars: [{
      bak: 1,
      baz: 1
    }, {
      bak: 1,
      baz: 2
    }, {
      bak: 2,
      baz: 3
    }]
  }
};
```

### Basic Usage

Path segments are delimitered by `'.'`.

```js
import get from 'get-lookup';

get(obj, 'foo.bars.1.baz'); // => 2
```

### Property Lookup Keys

Probably the most useful feature of `get-lookup` is ability to address objects
inside of arrays by their properties via lookup keys. In the example bellow we
use lookup key `{bak:1}`, which resolves to the very first item in `'foo.bars'`
array:

```js
get(obj, 'foo.bars.{bak:1}.baz'); // => 1
```

It is also possible to use several fields in property lookup keys to resolve
ambiguity:

```js
get(obj, 'foo.bars.{bak:1,baz:2}.baz'); // => 2
```

Note, however, that lookup keys should be used with simple values since they
uses `==` comparison.

### Default Value

If the value resolved by `get` function is `undefined`, the default value, if
provided, is returned in its place:

```js
const obj = {foo: {bar: 'baz'}};

get(obj, 'foo.baz', 'bak'); // => 'bak';
```

### Helpers

`get-lookup` also exports a set of helper functions related to it's internal
logic, but that may come in handy sometimes:

```js
import { isLookupKey, lookupIndex } from 'get-lookup';
```

- `isLookupKey(key)` - returns `true` if `key` represents a property lookup key.
- `lookupIndex(array, key)` - returns an integer index of the element of the
  given `array` that is identified by lookup key `key`. Returns `-1` if no
  corresponding element is found.

## License

MIT
