"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegerSumsFactory = exports.CircularCountFactory = exports.LoopingNumberSeriesFactory = exports.StaticNumberFactory = void 0;
var ranges_1 = require("./ranges");
var StaticNumberFactory = /** @class */ (function () {
    function StaticNumberFactory(value) {
        if (value === void 0) { value = 0; }
        this.value = value;
    }
    StaticNumberFactory.prototype.generate = function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    return [4 /*yield*/, this.value];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    };
    return StaticNumberFactory;
}());
exports.StaticNumberFactory = StaticNumberFactory;
var LoopingNumberSeriesFactory = /** @class */ (function () {
    function LoopingNumberSeriesFactory(values) {
        if (values === void 0) { values = []; }
        this.values = values;
    }
    LoopingNumberSeriesFactory.prototype.generate = function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = -1;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    index++;
                    if (index >= this.values.length) {
                        index = 0;
                    }
                    return [4 /*yield*/, this.values[index]];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    return LoopingNumberSeriesFactory;
}());
exports.LoopingNumberSeriesFactory = LoopingNumberSeriesFactory;
var CircularCountFactory = /** @class */ (function () {
    function CircularCountFactory(range, step, start) {
        if (range === void 0) { range = new ranges_1.NumericRange(0, Number.MAX_SAFE_INTEGER); }
        if (step === void 0) { step = 1; }
        if (start === void 0) { start = step >= 0 ? range.min : range.max; }
        this.start = start;
        this.step = step;
        this.range = range;
    }
    CircularCountFactory.prototype.generate = function () {
        var position, bigStep, min, max, divisor, sum, offset, offset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    position = this.start;
                    bigStep = BigInt(this.step);
                    min = BigInt(this.range.min);
                    max = BigInt(this.range.max);
                    divisor = BigInt(this.range.size + 1);
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 3];
                    return [4 /*yield*/, position];
                case 2:
                    _a.sent();
                    sum = BigInt(position) + bigStep;
                    if (sum > max) {
                        offset = sum - max - BigInt(1);
                        position = Number(min + offset % divisor);
                    }
                    else if (sum < min) {
                        offset = sum - min + BigInt(1);
                        position = Number(max + offset % divisor);
                    }
                    else {
                        position = Number(sum);
                    }
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    };
    return CircularCountFactory;
}());
exports.CircularCountFactory = CircularCountFactory;
var IntegerSumsFactory = /** @class */ (function () {
    function IntegerSumsFactory(sources) {
        if (sources === void 0) { sources = []; }
        this.sources = sources;
    }
    IntegerSumsFactory.prototype.generate = function () {
        var maxInt, divisor, instances, sum, _i, instances_1, instance, offset, offset;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    maxInt = BigInt(Number.MAX_SAFE_INTEGER);
                    divisor = maxInt * BigInt(2) + BigInt(1);
                    instances = this.sources.map(function (source) { return source.generate(); });
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 8];
                    sum = BigInt(0);
                    for (_i = 0, instances_1 = instances; _i < instances_1.length; _i++) {
                        instance = instances_1[_i];
                        sum += BigInt(instance.next().value);
                    }
                    if (!(sum > maxInt)) return [3 /*break*/, 3];
                    offset = sum - maxInt - BigInt(1);
                    return [4 /*yield*/, Number(-maxInt + offset % divisor)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 3:
                    if (!(sum < -maxInt)) return [3 /*break*/, 5];
                    offset = sum + maxInt + BigInt(1);
                    return [4 /*yield*/, Number(maxInt + offset % divisor)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, Number(sum)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    };
    return IntegerSumsFactory;
}());
exports.IntegerSumsFactory = IntegerSumsFactory;
