import { type StringEncoder } from './encoders';
import { type IteratorFactory, type DerivedIteratorFactory } from './iterators';
import { type NumericRange } from './ranges';
export declare class CaesarCipher implements StringEncoder {
    characterRanges: NumericRange[];
    shiftFactory: DerivedIteratorFactory<string, number>;
    constructor(characterRanges?: NumericRange[], shift?: DerivedIteratorFactory<string, number> | IteratorFactory<number> | number);
    getShiftedCode(code: number, shift: number, range: NumericRange): number;
    encode(source: string): string;
    decode(source: string): string;
}
