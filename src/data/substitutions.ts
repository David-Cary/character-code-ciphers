import {
  type DataEncoder,
  ArrayEncodingState,
  type DataEvaluator,
  FixedResponseEvaluator
} from './encoders'
import {
  type NumericRange,
  type NumberInRange,
  getIntegerSum,
  wrapBigIntAsInteger
} from './ranges'

/**
 * Adds a key value to each character code, wrapping back around to
 * the start or end of the range if this takes them out of bounds.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {DataEvaluator<ArrayEncodingState<NumberInRange>, number>} shiftRule - generates the number to be added for a given character code
 * @property {NumericRange[]} codeRanges - set of character codes to be transfromed, with shifts wrapped to each sets limits
 */
export class CaesarCipher implements DataEncoder<number[]> {
  shiftRule: DataEvaluator<ArrayEncodingState<NumberInRange>, number>
  codeRanges: NumericRange[]

  constructor (
    codeRanges: NumericRange[] = [],
    shift: DataEvaluator<ArrayEncodingState<NumberInRange>, number> | number = 1
  ) {
    this.shiftRule = typeof shift === 'number'
      ? new FixedResponseEvaluator(shift)
      : shift
    this.codeRanges = codeRanges
  }

  encode (source: number[]): number[] {
    const state = new ArrayEncodingState<NumberInRange>()
    const results: number[] = []
    for (const value of source) {
      const range = this.codeRanges.find(range => range.contains(value))
      if (range != null) {
        state.index++
        state.decoded.push({ value, range })
        const shift = this.shiftRule.evaluate(state)
        const encoded = this.getShiftedCode(value, shift, range)
        state.encoded.push({ value: encoded, range })
        results.push(encoded)
      } else {
        results.push(value)
      }
    }
    return results
  }

  decode (source: number[]): number[] {
    const state = new ArrayEncodingState<NumberInRange>()
    const results: number[] = []
    for (const value of source) {
      const range = this.codeRanges.find(range => range.contains(value))
      if (range != null) {
        state.index++
        state.encoded.push({ value, range })
        const shift = -this.shiftRule.evaluate(state)
        const decoded = this.getShiftedCode(value, shift, range)
        state.decoded.push({ value: decoded, range })
        results.push(decoded)
      } else {
        results.push(value)
      }
    }
    return results
  }

  /**
   * Applies the given shift to a character code and ensures it stays in range.
   * @function
   * @param {number} code - value to be modified
   * @param {number} shift - value to be added
   * @param {NumericRange} range - limits the sum should be wrapped to
   * @returns {number}
   */
  getShiftedCode (
    code: number,
    shift: number,
    range: NumericRange
  ): number {
    const sum = getIntegerSum(code, shift)
    const wrapped = range.wrapNumber(sum)
    return wrapped
  }
}

/**
 * Provides a key that scales with the target index.
 * @template DataType
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<DataType>, number>}
 * @property {bigint} rate - amount the index is multiplied by
 */
export class ProgressiveEncodingKey<DataType = any>
implements DataEvaluator<ArrayEncodingState<DataType>, number> {
  rate: bigint

  constructor (
    rate: bigint | number = 1
  ) {
    this.rate = BigInt(rate)
  }

  evaluate (state: ArrayEncodingState): number {
    const bigProduct = this.rate * BigInt(state.index)
    const product = wrapBigIntAsInteger(bigProduct)
    return product
  }
}

/**
 * Repeatedly loops through a given set of keys, based on the provided index.
 * @template DataType
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<DataType>, number>}
 * @property {number[]} values - keys to iterate over
 */
export class CyclicEncodingKey<DataType = any>
implements DataEvaluator<ArrayEncodingState<DataType>, number> {
  values: number[]

  constructor (
    values: number[]
  ) {
    this.values = values
  }

  evaluate (state: ArrayEncodingState): number {
    const index = state.index % this.values.length
    return this.values[index] ?? 0
  }
}

/**
 * Generates keys from prior decoded values.
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<NumberInRange>, number>}
 * @property {number[]} padding - initial set of keys to be used
 * @property {boolean} useOffsets - indicates shifts should be relative to the provided code's range
 */
export class AutokeyFactory
implements DataEvaluator<ArrayEncodingState<NumberInRange>, number> {
  padding: number[]
  useOffsets: boolean

  constructor (
    padding: number[] = [],
    useOffsets = false
  ) {
    this.padding = padding
    this.useOffsets = useOffsets
  }

  evaluate (state: ArrayEncodingState<NumberInRange>): number {
    if (state.index < this.padding.length) {
      return this.padding[state.index]
    }
    const offsetIndex = state.index - this.padding.length
    const character = state.decoded[offsetIndex]
    if (character != null) {
      return this.useOffsets
        ? character.value - character.range.min
        : character.value
    }
    return 0
  }
}

/**
 * Flips particular bits with each character code.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {DataEvaluator<ArrayEncodingState<number>, number>} keyRule - generates the bits to be flipped for a given character code
 */
export class XorCipher
implements DataEncoder<number[]> {
  keyRule: DataEvaluator<ArrayEncodingState<number>, number>

  constructor (
    key: DataEvaluator<ArrayEncodingState<number>, number>
    | number = 1
  ) {
    this.keyRule = typeof key === 'number'
      ? new FixedResponseEvaluator(key)
      : key
  }

  encode (source: number[]): number[] {
    const state = new ArrayEncodingState<number>(source)
    for (state.index = 0; state.index < source.length; state.index++) {
      const value = source[state.index]
      const key = this.keyRule.evaluate(state) & 0xffff
      const encoded = value ^ key
      state.encoded.push(encoded)
    }
    return state.encoded
  }

  decode (source: number[]): number[] {
    const state = new ArrayEncodingState<number>([], source)
    for (state.index = 0; state.index < source.length; state.index++) {
      const value = source[state.index]
      const key = this.keyRule.evaluate(state) & 0xffff
      const decoded = value ^ key
      state.decoded.push(decoded)
    }
    return state.decoded
  }
}
