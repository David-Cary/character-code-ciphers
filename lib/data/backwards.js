"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackwardsCipher = void 0;
/**
 * Reverses the order of the provided character codes.
 * @class
 * @implements {DataEncoder<number[]>}
 */
var BackwardsCipher = /** @class */ (function () {
    function BackwardsCipher() {
    }
    BackwardsCipher.prototype.encode = function (source) {
        return source.slice().reverse();
    };
    BackwardsCipher.prototype.decode = function (source) {
        return source.slice().reverse();
    };
    return BackwardsCipher;
}());
exports.BackwardsCipher = BackwardsCipher;
