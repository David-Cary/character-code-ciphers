import {
  CharacterCodeCipher,
  CaesarCipher,
  CyclicEncodingKey,
  ProgressiveEncodingKey,
  AutokeyFactory,
  SumEvaluator,
  XorCipher,
  LayeredDataEncoder,
  parseCharacterCodeRanges,
  stringToCharacterOffsets
} from "../src/index"

describe("CharacterCodeCipher", () => {
  const latinRanges = parseCharacterCodeRanges('azAZ')
  describe("using CaesarCipher", () => {
    describe("using default shift", () => {
      const cipher = new CharacterCodeCipher(
        new CaesarCipher(latinRanges)
      )
      test("should encode/decode", () => {
        const source = "Zoo A"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("App B")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
    describe("as ROT-13", () => {
      const cipher = new CharacterCodeCipher(
        new CaesarCipher(latinRanges, 13)
      )
      test("should encode/decode", () => {
        const source = "Cat"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("Png")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
    describe("as Vigenère cipher", () => {
      const cipher = new CharacterCodeCipher(
        new CaesarCipher(
          latinRanges,
          new CyclicEncodingKey(
            stringToCharacterOffsets('time', 'a')
          )
        )
      )
      test("should encode/decode", () => {
        const source = "Do you have the.."
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("Ww ksn pmzx bti..")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
    describe("using ProgressiveEncodingKey", () => {
      const cipher = new CharacterCodeCipher(
        new CaesarCipher(
          latinRanges,
          new ProgressiveEncodingKey(2)
        )
      )
      test("should encode/decode", () => {
        const source = "Dog"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("Dqk")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
    describe("with AutokeyFactory", () => {
      const cipher = new CharacterCodeCipher(
        new CaesarCipher(
          latinRanges,
          new AutokeyFactory(
            [2, 1],
            true
          )
        )
      )
      test("should encode/decode", () => {
        const source = "Able"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("Cclf")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
    describe("with SumEvaluator", () => {
      const cipher = new CharacterCodeCipher(
        new CaesarCipher(
          latinRanges,
          new SumEvaluator(
            [
              new ProgressiveEncodingKey(2),
              new CyclicEncodingKey([1,2])
            ]
          )
        )
      )
      test("should apply sum of all shifts", () => {
        const source = "Hat"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("Iey")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
  })
  describe("with XorCipher", () => {
    describe("using default key", () => {
      const cipher = new CharacterCodeCipher(
        new XorCipher()
      )
      test("should encode/decode", () => {
        const source = "Ask"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("@rj")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
    describe("using fixed key", () => {
      const cipher = new CharacterCodeCipher(
        new XorCipher(2)
      )
      test("should encode/decode", () => {
        const source = "Ask"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("Cqi")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
    describe("using cyclic key", () => {
      const cipher = new CharacterCodeCipher(
        new XorCipher(
          new CyclicEncodingKey([1, 2])
        )
      )
      test("should encode/decode", () => {
        const source = "Ask"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("@qj")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
  })
  describe("with LayeredDataEncoder", () => {
    describe("xor then shift", () => {
      const cipher = new CharacterCodeCipher(
        new LayeredDataEncoder([
          new XorCipher(2),
          new CaesarCipher(latinRanges)
        ])
      )
      test("should encode/decode", () => {
        const source = "Ask"
        const encoded = cipher.encode(source)
        expect(encoded).toEqual("Drj")
        const decoded = cipher.decode(encoded)
        expect(decoded).toEqual(source)
      })
    })
  })
})