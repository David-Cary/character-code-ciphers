import { NumericRange } from './ranges'
import { type DataEncoder } from './encoders'

/**
 * Returns a range for all valid character codes
 * @function
 * @returns {NumericRange}
 */
export function getFullCharacterCodeRange (): NumericRange {
  return new NumericRange(0, 0xFFFF)
}

/**
 * Converts a string to a series of numeric ranges based on their character codes.
 * This is done by pairing characters, with each pair providing the limits for a given range.
 * If there are an odds number of characters the last one is ignored.
 * @function
 * @param {string} characters - characters used to populate the range
 * @returns {NumericRange[]}
 */
export function parseCharacterCodeRanges (
  characters: string
): NumericRange[] {
  const ranges: NumericRange[] = []
  for (let i = 0; i < characters.length; i += 2) {
    const firstCode = characters.charCodeAt(i)
    const j = i + 1
    const secondCode = j < characters.length
      ? characters.charCodeAt(j)
      : 0xFFFF
    const range = new NumericRange(firstCode, secondCode)
    ranges.push(range)
  }
  return ranges
}

/**
 * Breaks a string down into it's component character codes.
 * @function
 * @param {string} source - number to be wrapped
 * @returns {number[]}
 */
export function stringToCharacterCodes (
  source: string
): number[] {
  const codes: number[] = []
  for (let i = 0; i < source.length; i++) {
    codes.push(
      source.charCodeAt(i)
    )
  }
  return codes
}

/**
 * Generates a series of character code offsets from the provided text.
 * @function
 * @param {string} source - text offsets should be extracted from
 * @param {string} start - character to be used for offset 0
 * @returns {number[]}
 */
export function stringToCharacterOffsets (
  source: string,
  start: string
): number[] {
  const codes: number[] = []
  const base = start.charCodeAt(0)
  for (let i = 0; i < source.length; i++) {
    codes.push(
      source.charCodeAt(i) - base
    )
  }
  return codes
}

/**
 * Perform string encoding / decoding by transforming the associated character codes.
 * @class
 * @implements {DataEncoder<string>}
 * @property {DataEncoder<number[]>} encoder - encodes / decodes the character code sequence
 */
export class CharacterCodeCipher implements DataEncoder<string> {
  encoder: DataEncoder<number[]>

  constructor (
    encoder: DataEncoder<number[]>
  ) {
    this.encoder = encoder
  }

  encode (source: string): string {
    const codes = stringToCharacterCodes(source)
    const encoded = this.encoder.encode(codes)
    const text = String.fromCharCode.apply(null, encoded)
    return text
  }

  decode (source: string): string {
    const codes = stringToCharacterCodes(source)
    const decoded = this.encoder.decode(codes)
    const text = String.fromCharCode.apply(null, decoded)
    return text
  }
}
