'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Plugin = require('./Plugin');

var _Plugin2 = _interopRequireDefault(_Plugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var plugins = Symbol();

var PluginManager = function () {
    function PluginManager() {
        _classCallCheck(this, PluginManager);

        this[plugins] = _immutable2.default.List([]);
    }

    _createClass(PluginManager, [{
        key: 'register',
        value: function register(name, cb) {
            this[plugins] = this[plugins].push(new _Plugin2.default(name, cb));
        }
    }, {
        key: 'execute',
        value: function execute(command) {
            this[plugins].forEach(function (plugin) {
                return plugin.execute(command);
            });
        }
    }, {
        key: 'list',
        value: function list() {
            return this[plugins];
        }
    }]);

    return PluginManager;
}();

module.exports = new PluginManager();