"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SumEvaluator = exports.FixedResponseEvaluator = exports.ArrayEncodingState = exports.LayeredDataEncoder = exports.FixedValueEncoder = void 0;
var ranges_1 = require("./ranges");
/**
 * Dummy encoder that always return the same value.
 * This is mainly used as a sub-encoder when we want to allow for both fixed and context dependent keys.
 * @class
 * @property {DataType} value - value to be returned for both encode and decode
 */
var FixedValueEncoder = /** @class */ (function () {
    function FixedValueEncoder(value) {
        this.value = value;
    }
    FixedValueEncoder.prototype.encode = function (source) {
        return this.value;
    };
    FixedValueEncoder.prototype.decode = function (source) {
        return this.value;
    };
    return FixedValueEncoder;
}());
exports.FixedValueEncoder = FixedValueEncoder;
/**
 * Wraps a sequence of sub-encoders to be used back to back.
 * @class
 * @property {Array<DataEncoder<DataType>>} layers - child encoders to be used
 */
var LayeredDataEncoder = /** @class */ (function () {
    function LayeredDataEncoder(layers) {
        if (layers === void 0) { layers = []; }
        this.layers = layers;
    }
    LayeredDataEncoder.prototype.encode = function (source) {
        var result = source;
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            result = layer.encode(result);
        }
        return result;
    };
    LayeredDataEncoder.prototype.decode = function (source) {
        var result = source;
        for (var i = this.layers.length - 1; i >= 0; i--) {
            var layer = this.layers[i];
            result = layer.decode(result);
        }
        return result;
    };
    return LayeredDataEncoder;
}());
exports.LayeredDataEncoder = LayeredDataEncoder;
/**
 * Used to track the current state of encoding or decoding an array.
 * @class
 * @property {number} index - position of the data being modified
 */
var ArrayEncodingState = /** @class */ (function () {
    function ArrayEncodingState(decoded, encoded, index) {
        if (decoded === void 0) { decoded = []; }
        if (encoded === void 0) { encoded = []; }
        if (index === void 0) { index = -1; }
        this.decoded = decoded;
        this.encoded = encoded;
        this.index = index;
    }
    return ArrayEncodingState;
}());
exports.ArrayEncodingState = ArrayEncodingState;
/**
 * Dummy evaluator that always return the same value.
 * Usually used as a wrapper for the value when we want to allow for both fixed and content dependent reponses.
 * @template From, To
 * @class
 * @implements {DataEvaluator<From, To>}
 * @property {To} value - value to be returned for both encode and decode
 */
var FixedResponseEvaluator = /** @class */ (function () {
    function FixedResponseEvaluator(value) {
        this.value = value;
    }
    FixedResponseEvaluator.prototype.evaluate = function (source) {
        return this.value;
    };
    return FixedResponseEvaluator;
}());
exports.FixedResponseEvaluator = FixedResponseEvaluator;
/**
 * Adds up the responses of it's child delegate to a single integer value.
 * @template DataType
 * @class
 * @implements {DataEvaluator<DataType, number>}
 * @addends {Array<DataEvaluator<DataType, number>>} addends - child evaluators to be processed
 */
var SumEvaluator = /** @class */ (function () {
    function SumEvaluator(addends) {
        if (addends === void 0) { addends = []; }
        this.addends = addends;
    }
    SumEvaluator.prototype.evaluate = function (source) {
        var values = this.addends.map(function (addend) { return addend.evaluate(source); });
        var sum = ranges_1.getIntegerSum.apply(null, values);
        return sum;
    };
    return SumEvaluator;
}());
exports.SumEvaluator = SumEvaluator;
