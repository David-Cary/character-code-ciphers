"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterCodeCipher = exports.stringToCharacterOffsets = exports.stringToCharacterCodes = exports.parseCharacterCodeRanges = exports.getFullCharacterCodeRange = void 0;
var ranges_1 = require("./ranges");
/**
 * Returns a range for all valid character codes
 * @function
 * @returns {NumericRange}
 */
function getFullCharacterCodeRange() {
    return new ranges_1.NumericRange(0, 0xFFFF);
}
exports.getFullCharacterCodeRange = getFullCharacterCodeRange;
/**
 * Converts a string to a series of numeric ranges based on their character codes.
 * This is done by pairing characters, with each pair providing the limits for a given range.
 * If there are an odds number of characters the last one is ignored.
 * @function
 * @param {string} characters - characters used to populate the range
 * @returns {NumericRange[]}
 */
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
/**
 * Breaks a string down into it's component character codes.
 * @function
 * @param {string} source - number to be wrapped
 * @returns {number[]}
 */
function stringToCharacterCodes(source) {
    var codes = [];
    for (var i = 0; i < source.length; i++) {
        codes.push(source.charCodeAt(i));
    }
    return codes;
}
exports.stringToCharacterCodes = stringToCharacterCodes;
/**
 * Generates a series of character code offsets from the provided text.
 * @function
 * @param {string} source - text offsets should be extracted from
 * @param {string} start - character to be used for offset 0
 * @returns {number[]}
 */
function stringToCharacterOffsets(source, start) {
    var codes = [];
    var base = start.charCodeAt(0);
    for (var i = 0; i < source.length; i++) {
        codes.push(source.charCodeAt(i) - base);
    }
    return codes;
}
exports.stringToCharacterOffsets = stringToCharacterOffsets;
/**
 * Perform string encoding / decoding by transforming the associated character codes.
 * @class
 * @implements {DataEncoder<string>}
 * @property {DataEncoder<number[]>} encoder - encodes / decodes the character code sequence
 */
var CharacterCodeCipher = /** @class */ (function () {
    function CharacterCodeCipher(encoder) {
        this.encoder = encoder;
    }
    CharacterCodeCipher.prototype.encode = function (source) {
        var codes = stringToCharacterCodes(source);
        var encoded = this.encoder.encode(codes);
        var text = String.fromCharCode.apply(null, encoded);
        return text;
    };
    CharacterCodeCipher.prototype.decode = function (source) {
        var codes = stringToCharacterCodes(source);
        var decoded = this.encoder.decode(codes);
        var text = String.fromCharCode.apply(null, decoded);
        return text;
    };
    return CharacterCodeCipher;
}());
exports.CharacterCodeCipher = CharacterCodeCipher;
