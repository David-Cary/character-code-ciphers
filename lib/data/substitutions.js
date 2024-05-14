"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XorCipher = exports.AutokeyFactory = exports.CyclicEncodingKey = exports.ProgressiveEncodingKey = exports.CaesarCipher = void 0;
var encoders_1 = require("./encoders");
var ranges_1 = require("./ranges");
/**
 * Adds a key value to each character code, wrapping back around to
 * the start or end of the range if this takes them out of bounds.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {DataEvaluator<ArrayEncodingState<NumberInRange>, number>} shiftRule - generates the number to be added for a given character code
 * @property {NumericRange[]} codeRanges - set of character codes to be transfromed, with shifts wrapped to each sets limits
 */
var CaesarCipher = /** @class */ (function () {
    function CaesarCipher(codeRanges, shift) {
        if (codeRanges === void 0) { codeRanges = []; }
        if (shift === void 0) { shift = 1; }
        this.shiftRule = typeof shift === 'number'
            ? new encoders_1.FixedResponseEvaluator(shift)
            : shift;
        this.codeRanges = codeRanges;
    }
    CaesarCipher.prototype.encode = function (source) {
        var state = new encoders_1.ArrayEncodingState();
        var results = [];
        var _loop_1 = function (value) {
            var range = this_1.codeRanges.find(function (range) { return range.contains(value); });
            if (range != null) {
                state.index++;
                state.decoded.push({ value: value, range: range });
                var shift = this_1.shiftRule.evaluate(state);
                var encoded = this_1.getShiftedCode(value, shift, range);
                state.encoded.push({ value: encoded, range: range });
                results.push(encoded);
            }
            else {
                results.push(value);
            }
        };
        var this_1 = this;
        for (var _i = 0, source_1 = source; _i < source_1.length; _i++) {
            var value = source_1[_i];
            _loop_1(value);
        }
        return results;
    };
    CaesarCipher.prototype.decode = function (source) {
        var state = new encoders_1.ArrayEncodingState();
        var results = [];
        var _loop_2 = function (value) {
            var range = this_2.codeRanges.find(function (range) { return range.contains(value); });
            if (range != null) {
                state.index++;
                state.encoded.push({ value: value, range: range });
                var shift = -this_2.shiftRule.evaluate(state);
                var decoded = this_2.getShiftedCode(value, shift, range);
                state.decoded.push({ value: decoded, range: range });
                results.push(decoded);
            }
            else {
                results.push(value);
            }
        };
        var this_2 = this;
        for (var _i = 0, source_2 = source; _i < source_2.length; _i++) {
            var value = source_2[_i];
            _loop_2(value);
        }
        return results;
    };
    /**
     * Applies the given shift to a character code and ensures it stays in range.
     * @function
     * @param {number} code - value to be modified
     * @param {number} shift - value to be added
     * @param {NumericRange} range - limits the sum should be wrapped to
     * @returns {number}
     */
    CaesarCipher.prototype.getShiftedCode = function (code, shift, range) {
        var sum = (0, ranges_1.getIntegerSum)(code, shift);
        var wrapped = range.wrapNumber(sum);
        return wrapped;
    };
    return CaesarCipher;
}());
exports.CaesarCipher = CaesarCipher;
/**
 * Provides a key that scales with the target index.
 * @template DataType
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<DataType>, number>}
 * @property {bigint} rate - amount the index is multiplied by
 */
var ProgressiveEncodingKey = /** @class */ (function () {
    function ProgressiveEncodingKey(rate) {
        if (rate === void 0) { rate = 1; }
        this.rate = BigInt(rate);
    }
    ProgressiveEncodingKey.prototype.evaluate = function (state) {
        var bigProduct = this.rate * BigInt(state.index);
        var product = (0, ranges_1.wrapBigIntAsInteger)(bigProduct);
        return product;
    };
    return ProgressiveEncodingKey;
}());
exports.ProgressiveEncodingKey = ProgressiveEncodingKey;
/**
 * Repeatedly loops through a given set of keys, based on the provided index.
 * @template DataType
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<DataType>, number>}
 * @property {number[]} values - keys to iterate over
 */
var CyclicEncodingKey = /** @class */ (function () {
    function CyclicEncodingKey(values) {
        this.values = values;
    }
    CyclicEncodingKey.prototype.evaluate = function (state) {
        var _a;
        var index = state.index % this.values.length;
        return (_a = this.values[index]) !== null && _a !== void 0 ? _a : 0;
    };
    return CyclicEncodingKey;
}());
exports.CyclicEncodingKey = CyclicEncodingKey;
/**
 * Generates keys from prior decoded values.
 * @class
 * @implements {DataEvaluator<ArrayEncodingState<NumberInRange>, number>}
 * @property {number[]} padding - initial set of keys to be used
 * @property {boolean} useOffsets - indicates shifts should be relative to the provided code's range
 */
var AutokeyFactory = /** @class */ (function () {
    function AutokeyFactory(padding, useOffsets) {
        if (padding === void 0) { padding = []; }
        if (useOffsets === void 0) { useOffsets = false; }
        this.padding = padding;
        this.useOffsets = useOffsets;
    }
    AutokeyFactory.prototype.evaluate = function (state) {
        if (state.index < this.padding.length) {
            return this.padding[state.index];
        }
        var offsetIndex = state.index - this.padding.length;
        var character = state.decoded[offsetIndex];
        if (character != null) {
            return this.useOffsets
                ? character.value - character.range.min
                : character.value;
        }
        return 0;
    };
    return AutokeyFactory;
}());
exports.AutokeyFactory = AutokeyFactory;
/**
 * Flips particular bits with each character code.
 * @class
 * @implements {DataEncoder<number[]>}
 * @property {DataEvaluator<ArrayEncodingState<number>, number>} keyRule - generates the bits to be flipped for a given character code
 */
var XorCipher = /** @class */ (function () {
    function XorCipher(key) {
        if (key === void 0) { key = 1; }
        this.keyRule = typeof key === 'number'
            ? new encoders_1.FixedResponseEvaluator(key)
            : key;
    }
    XorCipher.prototype.encode = function (source) {
        var state = new encoders_1.ArrayEncodingState(source);
        for (state.index = 0; state.index < source.length; state.index++) {
            var value = source[state.index];
            var key = this.keyRule.evaluate(state) & 0xffff;
            var encoded = value ^ key;
            state.encoded.push(encoded);
        }
        return state.encoded;
    };
    XorCipher.prototype.decode = function (source) {
        var state = new encoders_1.ArrayEncodingState([], source);
        for (state.index = 0; state.index < source.length; state.index++) {
            var value = source[state.index];
            var key = this.keyRule.evaluate(state) & 0xffff;
            var decoded = value ^ key;
            state.decoded.push(decoded);
        }
        return state.decoded;
    };
    return XorCipher;
}());
exports.XorCipher = XorCipher;
