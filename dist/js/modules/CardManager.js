"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Immutable = require("Immutable");

var _Immutable2 = _interopRequireDefault(_Immutable);

var _hyperscript = require("hyperscript");

var _hyperscript2 = _interopRequireDefault(_hyperscript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OUTPUT = Symbol();
var Cards = Symbol();

var CardManager = function () {
    function CardManager(output) {
        _classCallCheck(this, CardManager);

        this[OUTPUT] = output;
        this[Cards] = _Immutable2.default.List([]);
    }

    _createClass(CardManager, [{
        key: "spawn",
        value: function spawn(hObj) {
            this[OUTPUT].insertBefore((0, _hyperscript2.default)('.card', hObj), this[OUTPUT].firstChild);
        }
    }, {
        key: "clear",
        value: function clear() {
            this[OUTPUT].innerHTML = "";
        }
    }]);

    return CardManager;
}();

module.exports = function (output) {
    return new CardManager(output);
};