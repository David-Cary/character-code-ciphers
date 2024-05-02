"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayeredStringEncoder = void 0;
var LayeredStringEncoder = /** @class */ (function () {
    function LayeredStringEncoder(layers) {
        if (layers === void 0) { layers = []; }
        this.layers = layers;
    }
    LayeredStringEncoder.prototype.encode = function (source) {
        var result = source;
        for (var _i = 0, _a = this.layers; _i < _a.length; _i++) {
            var layer = _a[_i];
            result = layer.encode(result);
        }
        return result;
    };
    LayeredStringEncoder.prototype.decode = function (source) {
        var result = source;
        for (var i = this.layers.length - 1; i >= 0; i--) {
            var layer = this.layers[i];
            result = layer.decode(result);
        }
        return result;
    };
    return LayeredStringEncoder;
}());
exports.LayeredStringEncoder = LayeredStringEncoder;
