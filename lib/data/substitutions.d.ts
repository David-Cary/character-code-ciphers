import { type DataEncoder, ArrayEncodingState, type DataEvaluator } from './encoders';
import { type NumericRange, type NumberInRange } from './ranges';
/**
 * Adds a key value to each character code, wrapping back around to
 * the start or end of the range if this takes them out of bounds.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {DataEvaluator<ArrayEncodingState<NumberInRange>, number>} shiftRule - generates the number to be added for a given character code
 * @property {NumericRange[]} codeRanges - set of character codes to be transfromed, with shifts wrapped to each sets limits
 */
export declare class CaesarCipher implements DataEncoder<number[]> {
    shiftRule: DataEvaluator<ArrayEncodingState<NumberInRange>, number>;
    codeRanges: NumericRange[];
    constructor(codeRanges?: NumericRange[], shift?: DataEvaluator<ArrayEncodingState<NumberInRange>, number> | number);
    encode(source: number[]): number[];
    decode(source: number[]): number[];
    /**
     * Applies the given shift to a character code and ensures it stays in range.
     * @function
     * @param {number} code - value to be modified
     * @param {number} shift - value to be added
     * @param {NumericRange} range - limits the sum should be wrapped to
     * @returns {number}
     */
    getShiftedCode(code: number, shift: number, range: NumericRange): number;
}
/**
 * Provides a key that scales with the target index.
 * @template DataType
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<DataType>, number>}
 * @property {bigint} rate - amount the index is multiplied by
 */
export declare class ProgressiveEncodingKey<DataType = any> implements DataEvaluator<ArrayEncodingState<DataType>, number> {
    rate: bigint;
    constructor(rate?: bigint | number);
    evaluate(state: ArrayEncodingState): number;
}
/**
 * Repeatedly loops through a given set of keys, based on the provided index.
 * @template DataType
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<DataType>, number>}
 * @property {number[]} values - keys to iterate over
 */
export declare class CyclicEncodingKey<DataType = any> implements DataEvaluator<ArrayEncodingState<DataType>, number> {
    values: number[];
    constructor(values: number[]);
    evaluate(state: ArrayEncodingState): number;
}
/**
 * Generates keys from prior decoded values.
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<NumberInRange>, number>}
 * @property {number[]} padding - initial set of keys to be used
 * @property {boolean} useOffsets - indicates shifts should be relative to the provided code's range
 */
export declare class AutokeyFactory implements DataEvaluator<ArrayEncodingState<NumberInRange>, number> {
    padding: number[];
    useOffsets: boolean;
    constructor(padding?: number[], useOffsets?: boolean);
    evaluate(state: ArrayEncodingState<NumberInRange>): number;
}
/**
 * Flips particular bits with each character code.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {DataEvaluator<ArrayEncodingState<number>, number>} keyRule - generates the bits to be flipped for a given character code
 */
export declare class XorCipher implements DataEncoder<number[]> {
    keyRule: DataEvaluator<ArrayEncodingState<number>, number>;
    constructor(key?: DataEvaluator<ArrayEncodingState<number>, number> | number);
    encode(source: number[]): number[];
    decode(source: number[]): number[];
}
