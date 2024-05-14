"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnarCipher = void 0;
var ColumnarCipher = /** @class */ (function () {
    function ColumnarCipher(spliceIndices) {
        if (spliceIndices === void 0) { spliceIndices = [1]; }
        this.spliceIndices = spliceIndices;
    }
    ColumnarCipher.prototype.encode = function (source) {
        var columns = this.getCharacterGrid(source);
        var shuffled = this.shuffleText(columns);
        return shuffled.join();
    };
    ColumnarCipher.prototype.getCharacterGrid = function (source) {
        var columns = [];
        var modulus = this.spliceIndices.length + 1;
        for (var i = 0; i < modulus; i++) {
            columns.push('');
        }
        for (var i = 0; i < source.length; i++) {
            var columnIndex = i % modulus;
            columns[columnIndex] += source.charAt(i);
        }
        return columns;
    };
    ColumnarCipher.prototype.shuffleText = function (source) {
        var shuffled = [];
        if (source.length > 0) {
            shuffled.push(source[0]);
            for (var i = 1; i < source.length; i++) {
                var j = i - 1;
                if (j < this.spliceIndices.length) {
                    shuffled.splice(this.spliceIndices[j], 0, source[i]);
                }
                else {
                    shuffled.push(source[i]);
                }
            }
        }
        return shuffled;
    };
    ColumnarCipher.prototype.decode = function (source) {
        return '';
    };
    return ColumnarCipher;
}());
exports.ColumnarCipher = ColumnarCipher;
