import { type StringEncoder } from './encoders';
import { type NumericIteratorFactory } from './number-gen';
import { NumericRange } from './ranges';
export declare function getFullCharacterCodeRange(): NumericRange;
export declare function parseCharacterCodeRanges(characters: string): NumericRange[];
export declare class ShiftCipher implements StringEncoder {
    characterCodeRanges: NumericRange[];
    shiftFactory: NumericIteratorFactory;
    constructor(characterCodeRanges?: NumericRange[], shiftFactory?: NumericIteratorFactory);
    encode(source: string): string;
    decode(source: string): string;
    shiftCharacterCode(code: number, shift: number, range: NumericRange): number;
}
