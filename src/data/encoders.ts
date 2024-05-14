import { getIntegerSum } from './ranges'

/**
 * Generic interface for instances that handle encoding to and decoding from a given format.
 * @template DataType
 * @interface
 */
export interface DataEncoder<DataType = any> {
  /**
   * Converts source to encoded format.
   * @function
   * @param {DataType} source - data to be encoded
   * @returns {DataType}
   */
  encode: (source: DataType) => DataType
  /**
   * Extracts original data from encoded data.
   * @function
   * @param {DataType} source - data to be decoded
   * @returns {DataType}
   */
  decode: (source: DataType) => DataType
}

/**
 * Dummy encoder that always return the same value.
 * This is mainly used as a sub-encoder when we want to allow for both fixed and context dependent keys.
 * @class
 * @property {DataType} value - value to be returned for both encode and decode
 */
export class FixedValueEncoder<DataType = any>
implements DataEncoder<DataType> {
  value: DataType

  constructor (value: DataType) {
    this.value = value
  }

  encode (source: DataType): DataType {
    return this.value
  }

  decode (source: DataType): DataType {
    return this.value
  }
}

/**
 * Wraps a sequence of sub-encoders to be used back to back.
 * @class
 * @property {Array<DataEncoder<DataType>>} layers - child encoders to be used
 */
export class LayeredDataEncoder<DataType = any>
implements DataEncoder<DataType> {
  readonly layers: Array<DataEncoder<DataType>>

  constructor (layers: Array<DataEncoder<DataType>> = []) {
    this.layers = layers
  }

  encode (source: DataType): DataType {
    let result = source
    for (const layer of this.layers) {
      result = layer.encode(result)
    }
    return result
  }

  decode (source: DataType): DataType {
    let result = source
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i]
      result = layer.decode(result)
    }
    return result
  }
}

/**
 * Used to track the current state of an encoding or decoding process.
 * @template DataType
 * @interface
 * @property {DataType} decoded - unencoded / decoded data
 * @property {DataType} encoded - encoded data
 */
export interface EncodingState<DataType = any> {
  decoded: DataType
  encoded: DataType
}

/**
 * Used to track the current state of encoding or decoding an array.
 * @class
 * @property {number} index - position of the data being modified
 */
export class ArrayEncodingState<DataType = any> implements EncodingState<DataType[]> {
  decoded: DataType[]
  encoded: DataType[]
  index: number

  constructor (
    decoded: DataType[] = [],
    encoded: DataType[] = [],
    index = -1
  ) {
    this.decoded = decoded
    this.encoded = encoded
    this.index = index
  }
}

/**
 * Used to retrieve a value for a particular data set / context.
 * @template From, To
 * @interface
 */
export interface DataEvaluator<From = any, To = From> {
  /**
   * Determines the value for a given context
   * @function
   * @param {From} source - context to be evaluated
   * @returns {To}
   */
  evaluate: (source: From) => To
}

/**
 * Dummy evaluator that always return the same value.
 * Usually used as a wrapper for the value when we want to allow for both fixed and content dependent reponses.
 * @template From, To
 * @class
 * @implements {DataEvaluator<From, To>}
 * @property {To} value - value to be returned for both encode and decode
 */
export class FixedResponseEvaluator<From = any, To = From>
implements DataEvaluator<From, To> {
  value: To

  constructor (value: To) {
    this.value = value
  }

  evaluate (source: From): To {
    return this.value
  }
}

/**
 * Adds up the responses of it's child delegate to a single integer value.
 * @template DataType
 * @class
 * @implements {DataEvaluator<DataType, number>}
 * @addends {Array<DataEvaluator<DataType, number>>} addends - child evaluators to be processed
 */
export class SumEvaluator<DataType = any>
implements DataEvaluator<DataType, number> {
  addends: Array<DataEvaluator<DataType, number>>

  constructor (
    addends: Array<DataEvaluator<DataType, number>> = []
  ) {
    this.addends = addends
  }

  evaluate (source: DataType): number {
    const values = this.addends.map(
      addend => addend.evaluate(source)
    )
    const sum = getIntegerSum.apply(null, values)
    return sum
  }
}
