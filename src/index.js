let lookupTermRegExp;

Object.defineProperty(get, "lookupTermRegExp", {
  enumerable: false,
  configurable: false,
  get() {
    return lookupTermRegExp;
  },
  set(value) {
    const segment = `${value.source}:${value.source}`;

    lookupTermRegExp = value;
    this.lookupKeyRegExp = new RegExp(`{${segment}(?:,${segment})*}`);
  }
});

get.lookupTermRegExp = /[\w\d_-]+/;

export default function get(object, path, defaultValue) {
  const result = doGet(object, path);

  return result === undefined ? defaultValue : result;
}

function doGet(object, path) {
  if (!object || !path) return object;

  const [_match, key, rest] = path.match(/^([^.]+)\.?(.+)?$/);

  if (isLookupKey(key)) {
    if (!Array.isArray(object)) {
      throw new Error(`Lookup key '${key}' cannot be used for non-array object ${JSON.stringify(object)}`);
    }

    return doGet(object[lookupIndex(object, key)], rest);
  }

  return doGet(object[key], rest);
}

export function isLookupKey(key) {
  return get.lookupKeyRegExp.test(key);
}

export function lookupIndex(collection, key) {
  const terms = key
    .substring(1, key.length - 1)
    .split(",")
    .map(t =>  t.split(":"));

  for (let i = 0; i < collection.length; i++) {
    if (collection[i] && matches(collection[i], terms)) {
      return i;
    }
  }

  return -1;
}

function matches(object, terms) {
  for (let i = 0; i < terms.length; i++) {
    if (object[terms[i][0]] != terms[i][1]) {
      return false;
    }
  }

  return true;
}
