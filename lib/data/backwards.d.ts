import { type DataEncoder } from './encoders';
/**
 * Reverses the order of the provided character codes.
 * @class
 * @implements {DataEncoder<number[]>}
 */
export declare class BackwardsCipher implements DataEncoder<number[]> {
    encode(source: number[]): number[];
    decode(source: number[]): number[];
}
