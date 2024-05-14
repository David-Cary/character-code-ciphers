/**
 * Ensures a paired minimum and maximum stay in the correct order.
 * @class
 * @property {number} min - minimum value
 * @property {number} max - maximum value
 */
export class NumericRange {
  protected _min: number = 0
  get min (): number { return this._min }
  set min (value: number) {
    this._min = value
    if (value > this._max) {
      this._max = value
    }
  }

  protected _max: number = 0
  get max (): number { return this._max }
  set max (value: number) {
    this._max = value
    if (value < this._min) {
      this._min = value
    }
  }

  /**
   * @readonly
   * @property {number}  size - difference between the maximum and minimum
   */
  get size (): number {
    return this._max - this._min
  }

  constructor (
    first: number = 0,
    second: number = 0
  ) {
    this.setLimits(first, second)
  }

  /**
   * Sets both limits at once.
   * @function
   * @param {number} first - first limit to be applied
   * @param {number} second - second limit to be applied
   */
  setLimits (first: number, second: number): void {
    if (first <= second) {
      this._min = first
      this._max = second
    } else {
      this._min = second
      this._max = first
    }
  }

  /**
   * Checks if the provided value is within this range.
   * @function
   * @param {number} value - number to be checked
   * @returns {boolean}
   */
  contains (value: number): boolean {
    return this._min <= value &&
      value <= this._max
  }

  /**
   * Forces a number into the range using modular arithmetic.
   * This means any issue past the maximum wrap around to the minimum
   * and any values below the minimum wrap around to the maximum.
   * @function
   * @param {number} value - number to be wrapped
   * @returns {number}
   */
  wrapNumber (value: number): number {
    if (value > this._max) {
      const offset = value - this._max - 1
      const divisor = this.size + 1
      return this._min + offset % divisor
    }
    if (value < this._min) {
      const offset = value - this._min + 1
      const divisor = this.size + 1
      return this._max + offset % divisor
    }
    return value
  }
}

/**
 * Reduces a BigInt to a safe integer using the same wrapping rule for numeric ranges.
 * @function
 * @param {number} value - number to be wrapped
 * @returns {number}
 */
export function wrapBigIntAsInteger (
  value: bigint
): number {
  const maxValue = BigInt(Number.MAX_SAFE_INTEGER)
  const minValue = BigInt(Number.MIN_SAFE_INTEGER)
  if (value > maxValue) {
    const one = BigInt(1)
    const offset = value - maxValue - one
    const divisor = maxValue - minValue + one
    return Number(minValue + offset % divisor)
  }
  if (value < minValue) {
    const one = BigInt(1)
    const offset = value - minValue + one
    const divisor = maxValue - minValue + one
    return Number(maxValue + offset % divisor)
  }
  return Number(value)
}

/**
 * Adds up numbers and ensures they remain with a safe integer range,
 * wrapping to negatives if they go too high or positive if they go too low.
 * @function
 * @param {...number} args - numbers to be added
 * @returns {number}
 */
export function getIntegerSum (
  ...args: number[]
): number {
  let sum = BigInt(0)
  for (const value of args) {
    sum += BigInt(value)
  }
  return wrapBigIntAsInteger(sum)
}

/**
 * Attaches a number to particular numeric range.
 * @interface
 * @property {number} value - number associated with the range
 * @property {NumericRange} range - associated limits for the value
 */
export interface NumberInRange {
  value: number
  range: NumericRange
}
