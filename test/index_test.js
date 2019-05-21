import { expect } from "chai";
import get, { isLookupKey, lookupIndex } from "../src";

describe("get", () => {
  const obj = {
    foo: {
      bars: [{
        baz: 1,
        bak: 2,
      }, {
        baz: 1,
        bak: 3
      }, {
        baz: 2,
        bak: 2
      }]
    }
  };

  it("returns deeply nested value", () => {
    expect(get(obj, "foo.bars.1.baz")).to.eq(1);
  });

  it("return undefined for missing value", () => {
    expect(get(obj, "bar.foos.1.baz")).to.eq(undefined);
  });

  it("returns value by lookup key", () => {
    expect(get(obj, "foo.bars.{baz:1}.bak")).to.eq(2);
  });

  it("returns value by multi-prop lookup key", () => {
    expect(get(obj, "foo.bars.{baz:1,bak:3}.bak")).to.eq(3);
  });

  it("throws an error when lookup key is used for non-array object", () => {
    expect(() => get(obj, "foo.bars.0.{baz:bak}"))
      .to.throw(/Lookup key '{baz:bak}' cannot be used for non-array object/);
  });
});

describe("isLookupKey", () => {
  it("returns true for lookup key", () => {
    expect(isLookupKey("{id:1}")).to.eq(true);
    expect(isLookupKey("{id:1,type:foo}")).to.eq(true);
    expect(isLookupKey("{item-name:item-value}")).to.eq(true);
  });

  it("returns false for non-lookup keys or for keys with extraordinary characters", () => {
    expect(isLookupKey("1")).to.eq(false);
    expect(isLookupKey("foo")).to.eq(false);
    expect(isLookupKey("{id:1")).to.eq(false);
    expect(isLookupKey("{i%d:1}")).to.eq(false);
  });
});

describe("lookupIndex", () => {
  const ary = [{bar: 1}, {bar: 2}, {bar: 3}];

  it("returns indes in array via lookup key", () => {
    expect(lookupIndex(ary, "{bar:2}")).to.eq(1);
  });
});
