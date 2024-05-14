import { type DataEncoder, ArrayEncodingState } from './encoders';
/**
 * Defines a column within a columnar cipher.
 * @class
 * @property {number | undefined} index - position the column should be moved to
 * @property {DataEncoder<number[]> | undefined} encoder - transformation to be applied to the column's codes
 */
export interface CipherColumn {
    index?: number;
    encoder?: DataEncoder<number[]>;
}
/**
 * Encodes by writing text into a grid row by row, transforming the grid, then reading the results column by column.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {CipherColumn[]} columns - defines the grid's columns
 */
export declare class ColumnarCipher implements DataEncoder<number[]> {
    columns: CipherColumn[];
    constructor(columns?: Array<CipherColumn | number> | number);
    encode(source: number[]): number[];
    decode(source: number[]): number[];
    /**
     * Generates a grid of character codes, grouped by column.
     * @function
     * @returns {Array<ArrayEncodingState<number>>}
     */
    createColumnStates(): Array<ArrayEncodingState<number>>;
    /**
     * Feeds codes into a grid, row by row.
     * @function
     * @param {number[]} source - characters codes to be used
     * @param {Array<ArrayEncodingState<number>>} destination - grid codes should be fed into
     */
    populateDecodedValues(source: number[], destination: Array<ArrayEncodingState<number>>): void;
    /**
     * Feeds codes into a grid, column by column with a minimal number of rows.
     * @function
     * @param {number[]} source - characters codes to be used
     * @param {Array<ArrayEncodingState<number>>} destination - grid codes should be fed into
     */
    populateEncodedValues(source: number[], destination: Array<ArrayEncodingState<number>>): void;
    /**
     * Reads the values of a grid row by row.
     * @function
     * @param {number[][]} columns - columns to be read
     * @returns {number[]}
     */
    readRowsFrom(columns: number[][]): number[];
    /**
     * Moves a column state to the same position as it's corresponding column definition.
     * @function
     * @param {Array<ArrayEncodingState<number>>} columnStates - columns to be reordered
     */
    revertColumnOrder(columnStates: Array<ArrayEncodingState<number>>): void;
    /**
     * Callback used to put indexed items in ascending order.
     * @function
     * @param {ArrayEncodingState} a - first value
     * @param {ArrayEncodingState} b - second value
     * @returns {number}
     */
    sortByIndex(a: ArrayEncodingState, b: ArrayEncodingState): number;
}
