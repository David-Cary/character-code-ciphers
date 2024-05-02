export interface StringEncoder {
  encode: (source: string) => string
  decode: (source: string) => string
}

export class LayeredStringEncoder implements StringEncoder {
  readonly layers: StringEncoder[]

  constructor (layers: StringEncoder[] = []) {
    this.layers = layers
  }

  encode (source: string): string {
    let result = source
    for (const layer of this.layers) {
      result = layer.encode(result)
    }
    return result
  }

  decode (source: string): string {
    let result = source
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i]
      result = layer.decode(result)
    }
    return result
  }
}
