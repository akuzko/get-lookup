export const lookupKeyRegExp = /{[\w\d:_\-,]+}/;

export default function get(object, path) {
  if (!object) return undefined;
  if (!path) return object;

  const [_match, key, rest] = path.match(/^([^.]+)\.?(.+)?$/);

  if (isLookupKey(key)) {
    if (!Array.isArray(object)) {
      throw new Error(`Lookup key '${key}' cannot be used for non-array object ${JSON.stringify(object)}`);
    }

    return get(object[lookupIndex(object, key)], rest);
  }

  return get(object[key], rest);
}


export function isLookupKey(key) {
  return lookupKeyRegExp.test(key);
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
