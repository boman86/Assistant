var assert = require('assert');
var HistoryManager = require('../../dist/js/modules/HistoryManager')();

describe("History", function () {
    describe("#Push()", function () {
        it("should push data onto the history stack", function() {
            HistoryManager.push("command 1")
            HistoryManager.push("command 2")

            assert.equal(2, HistoryManager.count())
        })
    })
})