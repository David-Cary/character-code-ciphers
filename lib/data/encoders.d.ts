export interface StringEncoder {
    encode: (source: string) => string;
    decode: (source: string) => string;
}
export declare class LayeredStringEncoder implements StringEncoder {
    readonly layers: StringEncoder[];
    constructor(layers?: StringEncoder[]);
    encode(source: string): string;
    decode(source: string): string;
}
