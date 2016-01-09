'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Robot = require('./Robot');

var _Robot2 = _interopRequireDefault(_Robot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
    function Plugin(name, cb) {
        _classCallCheck(this, Plugin);

        this.name = name;
        this.robot = new _Robot2.default();
        this.cb = cb;
        this.cb(this.robot);
        this.commands = this.robot.commands();
    }

    _createClass(Plugin, [{
        key: 'execute',
        value: function execute(command) {
            this.robot.test(command);
        }
    }]);

    return Plugin;
}();

module.exports = Plugin;