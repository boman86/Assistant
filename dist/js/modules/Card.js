"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Card = function () {
    function Card(title, contents) {
        _classCallCheck(this, Card);

        this.title = title;
        this.contents = contents;
    }

    _createClass(Card, [{
        key: "html",
        value: function html() {
            return "<div class=\"Card\">\n            <h3 class=\"Card__Title\">" + this.title + "</h3>\n            <div class=\"Card__Contents\">" + this.contents + "</div>\n        </div>";
        }
    }]);

    return Card;
}();

exports.default = Card;