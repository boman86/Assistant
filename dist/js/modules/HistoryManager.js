"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require("immutable");

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _history = Symbol();
var historyIndex = Symbol();
var localStorageKey = "__history";

var HistoryManager = function () {
    function HistoryManager() {
        _classCallCheck(this, HistoryManager);

        this[_history] = _immutable2.default.List([]);
        this[historyIndex] = 0;

        var json = localStorage.getItem(localStorageKey);

        if (json) {
            this.fromJson(json);
        }
    }

    _createClass(HistoryManager, [{
        key: "push",
        value: function push(item) {
            item = item.trim();

            if (!item) return;

            this[_history] = this[_history].push(_immutable2.default.Map({ command: item }));
            this[historyIndex] = this[_history].count() - 1;

            this.persist();
        }
    }, {
        key: "forward",
        value: function forward() {
            this[historyIndex] = Math.min(this[_history].count(), ++this[historyIndex]);

            var next = this[_history].get(this[historyIndex]);

            return next ? next.toJSON() : null;
        }
    }, {
        key: "backward",
        value: function backward() {
            var previous = this[_history].get(Math.max(0, this[historyIndex]));

            this[historyIndex] = Math.max(0, --this[historyIndex]);

            return previous ? previous.toJSON() : null;
        }
    }, {
        key: "history",
        value: function history() {
            var items = this[_history].map(function (e) {
                return e.toObject();
            });
            var total = this[_history].count();

            return {
                items: items,
                total: total,
                counter: this[historyIndex]
            };
        }
    }, {
        key: "count",
        value: function count() {
            return this[_history].count();
        }
    }, {
        key: "clear",
        value: function clear() {
            this[_history] = this[_history].clear();

            this.persist();
        }
    }, {
        key: "persist",
        value: function persist() {
            localStorage.setItem(localStorageKey, this.toJson());
        }
    }, {
        key: "toJson",
        value: function toJson() {
            return JSON.stringify(this[_history].toJSON());
        }
    }, {
        key: "fromJson",
        value: function fromJson(json) {
            if (typeof json == "string") {
                json = JSON.parse(json);
            }

            this[_history] = _immutable2.default.List(json).map(function (obj) {
                return _immutable2.default.Map(obj);
            });
            this[historyIndex] = this[_history].count() - 1;
        }
    }]);

    return HistoryManager;
}();

module.exports = new HistoryManager();