import {
  NumericRange,
  getIntegerSum
} from "../src/index"

describe("NumericRange", () => {
  test("should order constructor values", () => {
    const range = new NumericRange(5, 1)
    expect(range.min).toBe(1)
    expect(range.max).toBe(5)
  })
  test("setting max below min should force min down", () => {
    const range = new NumericRange(1, 5)
    range.max = 0
    expect(range.min).toBe(0)
    expect(range.max).toBe(0)
  })
  test("setting min above should force max up", () => {
    const range = new NumericRange(1, 5)
    range.min = 6
    expect(range.min).toBe(6)
    expect(range.max).toBe(6)
  })
  describe("wrapNumber", () => {
    const range = new NumericRange(1, 5)
    test("going past maximum should wrap to minimum", () => {
      const wrapped = range.wrapNumber(6)
      expect(wrapped).toBe(1)
    })
    test("going past minimum should wrap to maximum", () => {
      const wrapped = range.wrapNumber(0)
      expect(wrapped).toBe(5)
    })
  })
})

describe("getIntegerSum", () => {
  test("should wrap to negative for overly high sums", () => {
    const sum = getIntegerSum(Number.MAX_SAFE_INTEGER, 1)
    expect(sum).toBe(Number.MIN_SAFE_INTEGER)
  })
  test("should wrap to positive for overly low sums", () => {
    const sum = getIntegerSum(Number.MIN_SAFE_INTEGER, -1)
    expect(sum).toBe(Number.MAX_SAFE_INTEGER)
  })
  test("should handle safe sums normally", () => {
    const sum = getIntegerSum(1, 2)
    expect(sum).toBe(3)
  })
})