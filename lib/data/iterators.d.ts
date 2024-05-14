export interface IteratorFactory<ValueType = any> {
    createIterator: () => IterableIterator<ValueType>;
}
export declare class StaticIteratorFactory<ValueType = any> implements IteratorFactory<ValueType> {
    value: ValueType;
    constructor(value: ValueType);
    createIterator(): IterableIterator<ValueType>;
}
export declare class CyclicIteratorFactory<ValueType = any> implements IteratorFactory<ValueType> {
    values: ValueType[];
    constructor(values: ValueType[]);
    createIterator(): IterableIterator<ValueType>;
}
export interface DerivedIteratorFactory<SourceType = any, ValueType = SourceType> {
    createIteratorFor: (source: SourceType) => IterableIterator<ValueType>;
}
export declare class UnderivedIteratorFactory<SourceType = any, ValueType = SourceType> implements DerivedIteratorFactory<SourceType, ValueType> {
    subfactory: IteratorFactory<ValueType>;
    constructor(subfactory: IteratorFactory<ValueType>);
    createIteratorFor(): IterableIterator<ValueType>;
}
export declare function getDerivedIteratorFactory<SourceType = any, ValueType = SourceType>(source: DerivedIteratorFactory<SourceType, ValueType> | IteratorFactory<ValueType> | ValueType): DerivedIteratorFactory<SourceType, ValueType>;
