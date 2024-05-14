"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaesarCipher = void 0;
var iterators_1 = require("./iterators");
var ranges_1 = require("./ranges");
var characters_1 = require("./characters");
var CaesarCipher = /** @class */ (function () {
    function CaesarCipher(characterRanges, shift) {
        if (characterRanges === void 0) { characterRanges = [
            (0, characters_1.getFullCharacterCodeRange)()
        ]; }
        if (shift === void 0) { shift = 1; }
        this.characterRanges = characterRanges;
        this.shiftFactory = (0, iterators_1.getDerivedIteratorFactory)(shift);
    }
    CaesarCipher.prototype.getShiftedCode = function (code, shift, range) {
        var sum = (0, ranges_1.getIntegerSum)(code, shift);
        return range.wrapNumber(sum);
    };
    CaesarCipher.prototype.encode = function (source) {
        var result = '';
        var shifts = this.shiftFactory.createIteratorFor(source);
        for (var i = 0; i < source.length; i++) {
            var code = source.charCodeAt(i);
            for (var _i = 0, _a = this.characterRanges; _i < _a.length; _i++) {
                var range = _a[_i];
                if (range.contains(code)) {
                    var shift = shifts.next().value;
                    code = this.getShiftedCode(code, shift, range);
                    break;
                }
            }
            result += String.fromCharCode(code);
        }
        return result;
    };
    CaesarCipher.prototype.decode = function (source) {
        var result = '';
        var shifts = this.shiftFactory.createIteratorFor(source);
        for (var i = 0; i < source.length; i++) {
            var code = source.charCodeAt(i);
            for (var j = this.characterRanges.length - 1; j >= 0; j--) {
                var range = this.characterRanges[j];
                if (range.contains(code)) {
                    var shift = -shifts.next().value;
                    code = this.getShiftedCode(code, shift, range);
                    break;
                }
            }
            result += String.fromCharCode(code);
        }
        return result;
    };
    return CaesarCipher;
}());
exports.CaesarCipher = CaesarCipher;
