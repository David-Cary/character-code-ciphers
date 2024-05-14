import { NumericRange } from './ranges';
import { type DataEncoder } from './encoders';
/**
 * Returns a range for all valid character codes
 * @function
 * @returns {NumericRange}
 */
export declare function getFullCharacterCodeRange(): NumericRange;
/**
 * Converts a string to a series of numeric ranges based on their character codes.
 * This is done by pairing characters, with each pair providing the limits for a given range.
 * If there are an odds number of characters the last one is ignored.
 * @function
 * @param {string} characters - characters used to populate the range
 * @returns {NumericRange[]}
 */
export declare function parseCharacterCodeRanges(characters: string): NumericRange[];
/**
 * Breaks a string down into it's component character codes.
 * @function
 * @param {string} source - number to be wrapped
 * @returns {number[]}
 */
export declare function stringToCharacterCodes(source: string): number[];
/**
 * Generates a series of character code offsets from the provided text.
 * @function
 * @param {string} source - text offsets should be extracted from
 * @param {string} start - character to be used for offset 0
 * @returns {number[]}
 */
export declare function stringToCharacterOffsets(source: string, start: string): number[];
/**
 * Perform string encoding / decoding by transforming the associated character codes.
 * @class
 * @implements {DataEncoder<string>}
 * @property {DataEncoder<number[]>} encoder - encodes / decodes the character code sequence
 */
export declare class CharacterCodeCipher implements DataEncoder<string> {
    encoder: DataEncoder<number[]>;
    constructor(encoder: DataEncoder<number[]>);
    encode(source: string): string;
    decode(source: string): string;
}
