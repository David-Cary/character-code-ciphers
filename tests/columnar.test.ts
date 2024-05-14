import {
  CharacterCodeCipher,
  ColumnarCipher,
  BackwardsCipher
} from "../src/index"

describe("ColumnarCipher", () => {
  describe("using defaults", () => {
    const cipher = new CharacterCodeCipher(
      new ColumnarCipher()
    )
    test("should encode/decode", () => {
      const source = "Cork"
      const encoded = cipher.encode(source)
      expect(encoded).toEqual("Crok")
      const decoded = cipher.decode(encoded)
      expect(decoded).toEqual(source)
    })
  })
  describe("using column count", () => {
    const cipher = new CharacterCodeCipher(
      new ColumnarCipher(3)
    )
    test("should encode/decode", () => {
      const source = "Rowboat"
      const encoded = cipher.encode(source)
      expect(encoded).toEqual("Rbtoowa")
      const decoded = cipher.decode(encoded)
      expect(decoded).toEqual(source)
    })
  })
  describe("using index order", () => {
    const cipher = new CharacterCodeCipher(
      new ColumnarCipher([1, 0])
    )
    test("should encode/decode", () => {
      const source = "Cork"
      const encoded = cipher.encode(source)
      expect(encoded).toEqual("okCr")
      const decoded = cipher.decode(encoded)
      expect(decoded).toEqual(source)
    })
  })
  describe("using column specific encoders", () => {
    const cipher = new CharacterCodeCipher(
      new ColumnarCipher([
        {
          index: 1,
          encoder: new BackwardsCipher()
        },
        0
      ])
    )
    test("should encode/decode", () => {
      const source = "Cork"
      const encoded = cipher.encode(source)
      expect(encoded).toEqual("okrC")
      const decoded = cipher.decode(encoded)
      expect(decoded).toEqual(source)
    })
  })
})