import {
  type DataEncoder,
  ArrayEncodingState
} from './encoders'

/**
 * Defines a column within a columnar cipher.
 * @class
 * @property {number | undefined} index - position the column should be moved to
 * @property {DataEncoder<number[]> | undefined} encoder - transformation to be applied to the column's codes
 */
export interface CipherColumn {
  index?: number
  encoder?: DataEncoder<number[]>
}

/**
 * Encodes by writing text into a grid row by row, transforming the grid, then reading the results column by column.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {CipherColumn[]} columns - defines the grid's columns
 */
export class ColumnarCipher implements DataEncoder<number[]> {
  columns: CipherColumn[]

  constructor (
    columns: Array<CipherColumn | number> | number = 2
  ) {
    if (typeof columns === 'number') {
      this.columns = []
      this.columns.length = columns
      this.columns.fill({}, 0, columns)
    } else {
      this.columns = columns.map(
        column => typeof column === 'number'
          ? { index: column }
          : column
      )
    }
  }

  encode (source: number[]): number[] {
    // Create code columns.
    const columnStates = this.createColumnStates()
    // Populate those columns from the source.
    this.populateDecodedValues(source, columnStates)
    // Apply enocoding to each column.
    for (let i = 0; i < columnStates.length; i++) {
      const state = columnStates[i]
      state.encoded = state.decoded
      const column = this.columns[i]
      if (column?.encoder != null) {
        state.encoded = column.encoder.encode(state.encoded)
      }
    }
    // Enforce column ordering.
    columnStates.sort(this.sortByIndex)
    // Flatten the columns back into an code list.
    const encoded = columnStates.map(state => state.encoded)
    const results = encoded.flat()
    return results
  }

  decode (source: number[]): number[] {
    // Create code columns.
    const columnStates = this.createColumnStates()
    // Put them in their encoded order.
    columnStates.sort(this.sortByIndex)
    // Feed the codes into the ordered columns.
    this.populateEncodedValues(source, columnStates)
    // Put the columns back in their unencoded order.
    this.revertColumnOrder(columnStates)
    // Decode each column.
    for (let i = 0; i < columnStates.length; i++) {
      const state = columnStates[i]
      state.decoded = state.encoded
      const column = this.columns[i]
      if (column?.encoder != null) {
        state.decoded = column.encoder.decode(state.decoded)
      }
    }
    // Extract decoded values
    const decoded = columnStates.map(state => state.decoded)
    // Flatten the data by reading the grid row by row.
    const results = this.readRowsFrom(decoded)
    return results
  }

  /**
   * Generates a grid of character codes, grouped by column.
   * @function
   * @returns {Array<ArrayEncodingState<number>>}
   */
  createColumnStates (): Array<ArrayEncodingState<number>> {
    const columnStates: Array<ArrayEncodingState<number>> = []
    for (let i = 0; i < this.columns.length; i++) {
      const index = this.columns[i].index ?? i
      const state = new ArrayEncodingState<number>([], [], index)
      columnStates.push(state)
    }
    return columnStates
  }

  /**
   * Feeds codes into a grid, row by row.
   * @function
   * @param {number[]} source - characters codes to be used
   * @param {Array<ArrayEncodingState<number>>} destination - grid codes should be fed into
   */
  populateDecodedValues (
    source: number[],
    destination: Array<ArrayEncodingState<number>>
  ): void {
    for (let i = 0; i < source.length; i++) {
      const index = i % destination.length
      if (index < destination.length) {
        destination[index].decoded.push(source[i])
      }
    }
  }

  /**
   * Feeds codes into a grid, column by column with a minimal number of rows.
   * @function
   * @param {number[]} source - characters codes to be used
   * @param {Array<ArrayEncodingState<number>>} destination - grid codes should be fed into
   */
  populateEncodedValues (
    source: number[],
    destination: Array<ArrayEncodingState<number>>
  ): void {
    const minSize = Math.floor(source.length / destination.length)
    const longCount = source.length % destination.length
    let start = 0
    for (let i = 0; i < destination.length; i++) {
      const size = i < longCount ? minSize + 1 : minSize
      const end = start + size
      destination[i].encoded = source.slice(start, end)
      start = end
    }
  }

  /**
   * Reads the values of a grid row by row.
   * @function
   * @param {number[][]} columns - columns to be read
   * @returns {number[]}
   */
  readRowsFrom (columns: number[][]): number[] {
    const results: number[] = []
    for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
      for (let j = 0; j < columns.length; j++) {
        const column = columns[j]
        if (i >= column.length) return results
        results.push(column[i])
      }
    }
    return results
  }

  /**
   * Moves a column state to the same position as it's corresponding column definition.
   * @function
   * @param {Array<ArrayEncodingState<number>>} columnStates - columns to be reordered
   */
  revertColumnOrder (
    columnStates: Array<ArrayEncodingState<number>>
  ): void {
    for (let i = 0; i < this.columns.length; i++) {
      const encodedIndex = this.columns[i].index ?? i
      for (let j = i; j < columnStates.length; j++) {
        const state = columnStates[j]
        if (state.index === encodedIndex) {
          columnStates[j] = columnStates[i]
          columnStates[i] = state
          break
        }
      }
    }
  }

  /**
   * Callback used to put indexed items in ascending order.
   * @function
   * @param {ArrayEncodingState} a - first value
   * @param {ArrayEncodingState} b - second value
   * @returns {number}
   */
  sortByIndex (a: ArrayEncodingState, b: ArrayEncodingState): number {
    return a.index - b.index
  }
}
