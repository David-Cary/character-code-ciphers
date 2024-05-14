import { type StringEncoder } from './encoders';
export declare class ColumnarCipher implements StringEncoder {
    spliceIndices: number[];
    constructor(spliceIndices?: number[]);
    encode(source: string): string;
    getCharacterGrid(source: string): string[];
    shuffleText(source: string[]): string[];
    decode(source: string): string;
}
