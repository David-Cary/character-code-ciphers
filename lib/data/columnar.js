"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnarCipher = void 0;
var encoders_1 = require("./encoders");
/**
 * Encodes by writing text into a grid row by row, transforming the grid, then reading the results column by column.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {CipherColumn[]} columns - defines the grid's columns
 */
var ColumnarCipher = /** @class */ (function () {
    function ColumnarCipher(columns) {
        if (columns === void 0) { columns = 2; }
        if (typeof columns === 'number') {
            this.columns = [];
            this.columns.length = columns;
            this.columns.fill({}, 0, columns);
        }
        else {
            this.columns = columns.map(function (column) { return typeof column === 'number'
                ? { index: column }
                : column; });
        }
    }
    ColumnarCipher.prototype.encode = function (source) {
        // Create code columns.
        var columnStates = this.createColumnStates();
        // Populate those columns from the source.
        this.populateDecodedValues(source, columnStates);
        // Apply enocoding to each column.
        for (var i = 0; i < columnStates.length; i++) {
            var state = columnStates[i];
            state.encoded = state.decoded;
            var column = this.columns[i];
            if ((column === null || column === void 0 ? void 0 : column.encoder) != null) {
                state.encoded = column.encoder.encode(state.encoded);
            }
        }
        // Enforce column ordering.
        columnStates.sort(this.sortByIndex);
        // Flatten the columns back into an code list.
        var encoded = columnStates.map(function (state) { return state.encoded; });
        var results = encoded.flat();
        return results;
    };
    ColumnarCipher.prototype.decode = function (source) {
        // Create code columns.
        var columnStates = this.createColumnStates();
        // Put them in their encoded order.
        columnStates.sort(this.sortByIndex);
        // Feed the codes into the ordered columns.
        this.populateEncodedValues(source, columnStates);
        // Put the columns back in their unencoded order.
        this.revertColumnOrder(columnStates);
        // Decode each column.
        for (var i = 0; i < columnStates.length; i++) {
            var state = columnStates[i];
            state.decoded = state.encoded;
            var column = this.columns[i];
            if ((column === null || column === void 0 ? void 0 : column.encoder) != null) {
                state.decoded = column.encoder.decode(state.decoded);
            }
        }
        // Extract decoded values
        var decoded = columnStates.map(function (state) { return state.decoded; });
        // Flatten the data by reading the grid row by row.
        var results = this.readRowsFrom(decoded);
        return results;
    };
    /**
     * Generates a grid of character codes, grouped by column.
     * @function
     * @returns {Array<ArrayEncodingState<number>>}
     */
    ColumnarCipher.prototype.createColumnStates = function () {
        var _a;
        var columnStates = [];
        for (var i = 0; i < this.columns.length; i++) {
            var index = (_a = this.columns[i].index) !== null && _a !== void 0 ? _a : i;
            var state = new encoders_1.ArrayEncodingState([], [], index);
            columnStates.push(state);
        }
        return columnStates;
    };
    /**
     * Feeds codes into a grid, row by row.
     * @function
     * @param {number[]} source - characters codes to be used
     * @param {Array<ArrayEncodingState<number>>} destination - grid codes should be fed into
     */
    ColumnarCipher.prototype.populateDecodedValues = function (source, destination) {
        for (var i = 0; i < source.length; i++) {
            var index = i % destination.length;
            if (index < destination.length) {
                destination[index].decoded.push(source[i]);
            }
        }
    };
    /**
     * Feeds codes into a grid, column by column with a minimal number of rows.
     * @function
     * @param {number[]} source - characters codes to be used
     * @param {Array<ArrayEncodingState<number>>} destination - grid codes should be fed into
     */
    ColumnarCipher.prototype.populateEncodedValues = function (source, destination) {
        var minSize = Math.floor(source.length / destination.length);
        var longCount = source.length % destination.length;
        var start = 0;
        for (var i = 0; i < destination.length; i++) {
            var size = i < longCount ? minSize + 1 : minSize;
            var end = start + size;
            destination[i].encoded = source.slice(start, end);
            start = end;
        }
    };
    /**
     * Reads the values of a grid row by row.
     * @function
     * @param {number[][]} columns - columns to be read
     * @returns {number[]}
     */
    ColumnarCipher.prototype.readRowsFrom = function (columns) {
        var results = [];
        for (var i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
            for (var j = 0; j < columns.length; j++) {
                var column = columns[j];
                if (i >= column.length)
                    return results;
                results.push(column[i]);
            }
        }
        return results;
    };
    /**
     * Moves a column state to the same position as it's corresponding column definition.
     * @function
     * @param {Array<ArrayEncodingState<number>>} columnStates - columns to be reordered
     */
    ColumnarCipher.prototype.revertColumnOrder = function (columnStates) {
        var _a;
        for (var i = 0; i < this.columns.length; i++) {
            var encodedIndex = (_a = this.columns[i].index) !== null && _a !== void 0 ? _a : i;
            for (var j = i; j < columnStates.length; j++) {
                var state = columnStates[j];
                if (state.index === encodedIndex) {
                    columnStates[j] = columnStates[i];
                    columnStates[i] = state;
                    break;
                }
            }
        }
    };
    /**
     * Callback used to put indexed items in ascending order.
     * @function
     * @param {ArrayEncodingState} a - first value
     * @param {ArrayEncodingState} b - second value
     * @returns {number}
     */
    ColumnarCipher.prototype.sortByIndex = function (a, b) {
        return a.index - b.index;
    };
    return ColumnarCipher;
}());
exports.ColumnarCipher = ColumnarCipher;
