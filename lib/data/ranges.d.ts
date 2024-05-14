/**
 * Ensures a paired minimum and maximum stay in the correct order.
 * @class
 * @property {number} min - minimum value
 * @property {number} max - maximum value
 */
export declare class NumericRange {
    protected _min: number;
    get min(): number;
    set min(value: number);
    protected _max: number;
    get max(): number;
    set max(value: number);
    /**
     * @readonly
     * @property {number}  size - difference between the maximum and minimum
     */
    get size(): number;
    constructor(first?: number, second?: number);
    /**
     * Sets both limits at once.
     * @function
     * @param {number} first - first limit to be applied
     * @param {number} second - second limit to be applied
     */
    setLimits(first: number, second: number): void;
    /**
     * Checks if the provided value is within this range.
     * @function
     * @param {number} value - number to be checked
     * @returns {boolean}
     */
    contains(value: number): boolean;
    /**
     * Forces a number into the range using modular arithmetic.
     * This means any issue past the maximum wrap around to the minimum
     * and any values below the minimum wrap around to the maximum.
     * @function
     * @param {number} value - number to be wrapped
     * @returns {number}
     */
    wrapNumber(value: number): number;
}
/**
 * Reduces a BigInt to a safe integer using the same wrapping rule for numeric ranges.
 * @function
 * @param {number} value - number to be wrapped
 * @returns {number}
 */
export declare function wrapBigIntAsInteger(value: bigint): number;
/**
 * Adds up numbers and ensures they remain with a safe integer range,
 * wrapping to negatives if they go too high or positive if they go too low.
 * @function
 * @param {...number} args - numbers to be added
 * @returns {number}
 */
export declare function getIntegerSum(...args: number[]): number;
/**
 * Attaches a number to particular numeric range.
 * @interface
 * @property {number} value - number associated with the range
 * @property {NumericRange} range - associated limits for the value
 */
export interface NumberInRange {
    value: number;
    range: NumericRange;
}
