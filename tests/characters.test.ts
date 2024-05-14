import {
  parseCharacterCodeRanges
} from "../src/index"

describe("parseCharacterCodeRanges", () => {
  test("should extract codes from character pairs", () => {
    const characters = "azAZ"
    const codes = parseCharacterCodeRanges(characters)
    expect(codes.length).toBe(2)
    expect(codes[0].min).toEqual(characters.charCodeAt(0))
    expect(codes[0].max).toEqual(characters.charCodeAt(1))
    expect(codes[1].min).toEqual(characters.charCodeAt(2))
    expect(codes[1].max).toEqual(characters.charCodeAt(3))
  })
})