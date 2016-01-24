import Event from "./Event"
import Immutable from "Immutable"

import Mousetrap from "Mousetrap"

const Bindings = Symbol()
const localStorageKey = "__keyBindings"

class KeyboardManager {
    constructor() {
        this[Bindings] = Immutable.List([])

        var json = localStorage.getItem(localStorageKey)

        if (json) {
            this.fromJson(json)
        }

        Event.on('keyboard:fetch_keyboard_list', cb => cb(this.keyboardBindings()))
    }

    keyboardBindings () {
        let items = this[Bindings].map(e => e.toObject())
        let total = this[Bindings].count()

        return {
            items,
            total
        }
    }

    registerEvent(binding, event) {
        this[Bindings] = this[Bindings].push(Immutable.Map({ binding, event }))

        Mousetrap.bind(binding, () => Event.fire(event))

        this.persist()
    }

    register(binding, cb) {
        this[Bindings] = this[Bindings].push(Immutable.Map({ binding, cb }))

        Mousetrap.bind(binding, cb)

        this.persist()
    }

    persist() {
        // localStorage.setItem(localStorageKey, this.toJson())
    }

    toJson() {
        return JSON.stringify(this[Bindings].toJSON())
    }

    fromJson(json) {
        if (typeof json == "string") {
            json = JSON.parse(json)
        }

        Immutable.List(json).forEach(item => this.register(item.binding, item.cb))
    }

    record(cb) {
        Mousetrap.record(cb)
    }
}

// Make recording possible
(function(Mousetrap) {
    var _recordedSequence = [],
        _recordedSequenceCallback = null,
        _currentRecordedKeys = [],
        _recordedCharacterKey = false,
        _recordTimer = null,
        _origHandleKey = Mousetrap.prototype.handleKey;
    function _handleKey(character, modifiers, e) {
        var self = this;

        if (!self.recording) {
            _origHandleKey.apply(self, arguments);
            return;
        }
        if (e.type == 'keydown') {
            if (character.length === 1 && _recordedCharacterKey) {
                _recordCurrentCombo();
            }

            for (var i = 0; i < modifiers.length; ++i) {
                _recordKey(modifiers[i]);
            }
            _recordKey(character);
        } else if (e.type == 'keyup' && _currentRecordedKeys.length > 0) {
            _recordCurrentCombo();
        }
    }
    function _recordKey(key) {
        for (var i = 0; i < _currentRecordedKeys.length; ++i) {
            if (_currentRecordedKeys[i] === key) {
                return;
            }
        }
        _currentRecordedKeys.push(key);

        if (key.length === 1) {
            _recordedCharacterKey = true;
        }
    }
    function _recordCurrentCombo() {
        _recordedSequence.push(_currentRecordedKeys);
        _currentRecordedKeys = [];
        _recordedCharacterKey = false;
        _restartRecordTimer();
    }
    function _normalizeSequence(sequence) {
        for (var i = 0; i < sequence.length; ++i) {
            sequence[i].sort(function(x, y) {
                // modifier keys always come first, in alphabetical order
                if (x.length > 1 && y.length === 1) {
                    return -1;
                } else if (x.length === 1 && y.length > 1) {
                    return 1;
                }
                return x > y ? 1 : -1;
            });

            sequence[i] = sequence[i].join('+');
        }
    }
    function _finishRecording() {
        if (_recordedSequenceCallback) {
            _normalizeSequence(_recordedSequence);
            _recordedSequenceCallback(_recordedSequence);
        }

        // reset all recorded state
        _recordedSequence = [];
        _recordedSequenceCallback = null;
        _currentRecordedKeys = [];
    }
    function _restartRecordTimer() {
        clearTimeout(_recordTimer);
        _recordTimer = setTimeout(_finishRecording, 1000);
    }
    Mousetrap.prototype.record = function(callback) {
        this.recording = true;
        _recordedSequenceCallback = function() {
            this.recording = false;
            callback.apply(this, arguments);
        }.bind(this);
    };
    Mousetrap.prototype.handleKey = function() {
        _handleKey.apply(this, arguments);
    };
    Mousetrap.init();
})(Mousetrap);

module.exports = new KeyboardManager()