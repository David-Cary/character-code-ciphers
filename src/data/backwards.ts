import {
  type DataEncoder
} from './encoders'

/**
 * Reverses the order of the provided character codes.
 * @class
 * @implements {DataEncoder<number[]>}
 */
export class BackwardsCipher implements DataEncoder<number[]> {
  encode (source: number[]): number[] {
    return source.slice().reverse()
  }

  decode (source: number[]): number[] {
    return source.slice().reverse()
  }
}
