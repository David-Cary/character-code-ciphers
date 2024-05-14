"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntegerSum = exports.wrapBigIntAsInteger = exports.NumericRange = void 0;
/**
 * Ensures a paired minimum and maximum stay in the correct order.
 * @class
 * @property {number} min - minimum value
 * @property {number} max - maximum value
 */
var NumericRange = /** @class */ (function () {
    function NumericRange(first, second) {
        if (first === void 0) { first = 0; }
        if (second === void 0) { second = 0; }
        this._min = 0;
        this._max = 0;
        this.setLimits(first, second);
    }
    Object.defineProperty(NumericRange.prototype, "min", {
        get: function () { return this._min; },
        set: function (value) {
            this._min = value;
            if (value > this._max) {
                this._max = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NumericRange.prototype, "max", {
        get: function () { return this._max; },
        set: function (value) {
            this._max = value;
            if (value < this._min) {
                this._min = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NumericRange.prototype, "size", {
        /**
         * @readonly
         * @property {number}  size - difference between the maximum and minimum
         */
        get: function () {
            return this._max - this._min;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets both limits at once.
     * @function
     * @param {number} first - first limit to be applied
     * @param {number} second - second limit to be applied
     */
    NumericRange.prototype.setLimits = function (first, second) {
        if (first <= second) {
            this._min = first;
            this._max = second;
        }
        else {
            this._min = second;
            this._max = first;
        }
    };
    /**
     * Checks if the provided value is within this range.
     * @function
     * @param {number} value - number to be checked
     * @returns {boolean}
     */
    NumericRange.prototype.contains = function (value) {
        return this._min <= value &&
            value <= this._max;
    };
    /**
     * Forces a number into the range using modular arithmetic.
     * This means any issue past the maximum wrap around to the minimum
     * and any values below the minimum wrap around to the maximum.
     * @function
     * @param {number} value - number to be wrapped
     * @returns {number}
     */
    NumericRange.prototype.wrapNumber = function (value) {
        if (value > this._max) {
            var offset = value - this._max - 1;
            var divisor = this.size + 1;
            return this._min + offset % divisor;
        }
        if (value < this._min) {
            var offset = value - this._min + 1;
            var divisor = this.size + 1;
            return this._max + offset % divisor;
        }
        return value;
    };
    return NumericRange;
}());
exports.NumericRange = NumericRange;
/**
 * Reduces a BigInt to a safe integer using the same wrapping rule for numeric ranges.
 * @function
 * @param {number} value - number to be wrapped
 * @returns {number}
 */
function wrapBigIntAsInteger(value) {
    var maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    var minValue = BigInt(Number.MIN_SAFE_INTEGER);
    if (value > maxValue) {
        var one = BigInt(1);
        var offset = value - maxValue - one;
        var divisor = maxValue - minValue + one;
        return Number(minValue + offset % divisor);
    }
    if (value < minValue) {
        var one = BigInt(1);
        var offset = value - minValue + one;
        var divisor = maxValue - minValue + one;
        return Number(maxValue + offset % divisor);
    }
    return Number(value);
}
exports.wrapBigIntAsInteger = wrapBigIntAsInteger;
/**
 * Adds up numbers and ensures they remain with a safe integer range,
 * wrapping to negatives if they go too high or positive if they go too low.
 * @function
 * @param {...number} args - numbers to be added
 * @returns {number}
 */
function getIntegerSum() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var sum = BigInt(0);
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var value = args_1[_a];
        sum += BigInt(value);
    }
    return wrapBigIntAsInteger(sum);
}
exports.getIntegerSum = getIntegerSum;
