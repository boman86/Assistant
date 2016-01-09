'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Immutable = require('Immutable');

var _Immutable2 = _interopRequireDefault(_Immutable);

var _execall = require('execall');

var _execall2 = _interopRequireDefault(_execall);

var _hyperscript = require('hyperscript');

var _hyperscript2 = _interopRequireDefault(_hyperscript);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observers = Symbol();

var Robot = function () {
    function Robot() {
        _classCallCheck(this, Robot);

        this[Observers] = _Immutable2.default.List([]);
    }

    _createClass(Robot, [{
        key: 'h',
        value: function h(tag, attrs, children) {
            return (0, _hyperscript2.default)(tag, attrs, children);
        }
    }, {
        key: 'spawnCard',
        value: function spawnCard(hObj) {
            window.cards.spawn(hObj);
        }
    }, {
        key: 'clearScreen',
        value: function clearScreen() {
            window.cards.clear();
        }
    }, {
        key: 'listen',
        value: function listen(regex, description, cb) {
            this[Observers] = this[Observers].push({
                regex: regex, description: description, cb: cb
            });
        }
    }, {
        key: 'test',
        value: function test(command) {
            this[Observers].filter(function (o) {
                return o.regex.test(command);
            }).forEach(function (o) {
                return o.cb({
                    command: command,
                    matches: (0, _execall2.default)(o.regex, command)
                });
            });
        }
    }, {
        key: 'commands',
        value: function commands() {
            return this[Observers].map(function (o) {
                return {
                    name: o.regex,
                    description: o.description
                };
            });
        }
    }]);

    return Robot;
}();

exports.default = Robot;