import { NumericRange } from './ranges';
export interface NumericIteratorFactory {
    generate: () => IterableIterator<number>;
}
export declare class StaticNumberFactory implements NumericIteratorFactory {
    value: number;
    constructor(value?: number);
    generate(): IterableIterator<number>;
}
export declare class LoopingNumberSeriesFactory implements NumericIteratorFactory {
    values: number[];
    constructor(values?: number[]);
    generate(): IterableIterator<number>;
}
export declare class CircularCountFactory implements NumericIteratorFactory {
    start: number;
    step: number;
    range: NumericRange;
    constructor(range?: NumericRange, step?: number, start?: number);
    generate(): IterableIterator<number>;
}
export declare class IntegerSumsFactory implements NumericIteratorFactory {
    sources: NumericIteratorFactory[];
    constructor(sources?: NumericIteratorFactory[]);
    generate(): IterableIterator<number>;
}
