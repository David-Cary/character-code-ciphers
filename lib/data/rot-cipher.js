"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROTCipher = exports.parseCharacterCodeRanges = exports.getFullCharacterCodeRange = void 0;
var number_gen_1 = require("./number-gen");
var ranges_1 = require("./ranges");
function getFullCharacterCodeRange() {
    return new ranges_1.NumericRange(0, 0xFFFF);
}
exports.getFullCharacterCodeRange = getFullCharacterCodeRange;
function parseCharacterCodeRanges(characters) {
    var ranges = [];
    for (var i = 0; i < characters.length; i += 2) {
        var firstCode = characters.charCodeAt(i);
        var j = i + 1;
        var secondCode = j < characters.length
            ? characters.charCodeAt(j)
            : 0xFFFF;
        var range = new ranges_1.NumericRange(firstCode, secondCode);
        ranges.push(range);
    }
    return ranges;
}
exports.parseCharacterCodeRanges = parseCharacterCodeRanges;
var ROTCipher = /** @class */ (function () {
    function ROTCipher(characterCodeRanges, shiftFactory) {
        if (characterCodeRanges === void 0) { characterCodeRanges = [
            getFullCharacterCodeRange()
        ]; }
        if (shiftFactory === void 0) { shiftFactory = new number_gen_1.StaticNumberFactory(1); }
        this.characterCodeRanges = characterCodeRanges;
        this.shiftFactory = shiftFactory;
    }
    ROTCipher.prototype.encode = function (source) {
        var result = '';
        var shifts = this.shiftFactory.generate();
        for (var i = 0; i < source.length; i++) {
            var code = source.charCodeAt(i);
            for (var _i = 0, _a = this.characterCodeRanges; _i < _a.length; _i++) {
                var range = _a[_i];
                if (range.contains(code)) {
                    var shift = shifts.next().value;
                    code = this.shiftCharacterCode(code, shift, range);
                    break;
                }
            }
            result += String.fromCharCode(code);
        }
        return result;
    };
    ROTCipher.prototype.decode = function (source) {
        var result = '';
        var shifts = this.shiftFactory.generate();
        for (var i = 0; i < source.length; i++) {
            var code = source.charCodeAt(i);
            for (var _i = 0, _a = this.characterCodeRanges; _i < _a.length; _i++) {
                var range = _a[_i];
                if (range.contains(code)) {
                    var shift = -shifts.next().value;
                    code = this.shiftCharacterCode(code, shift, range);
                    break;
                }
            }
            result += String.fromCharCode(code);
        }
        return result;
    };
    ROTCipher.prototype.shiftCharacterCode = function (code, shift, range) {
        var sum = BigInt(code) + BigInt(shift);
        var min = BigInt(range.min);
        var max = BigInt(range.max);
        var size = max - min;
        if (sum >= min) {
            var delta_1 = sum - min;
            var offset_1 = delta_1 % size;
            return Number(min + offset_1);
        }
        var delta = sum - max;
        var offset = delta % size;
        return Number(max + offset);
    };
    return ROTCipher;
}());
exports.ROTCipher = ROTCipher;
