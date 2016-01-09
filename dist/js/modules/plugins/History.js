'use strict';

module.exports = function (external) {
    return function (robot) {
        var h = robot.h;

        robot.listen(/^history$/, "A list of commands you have used previously.", function (res) {
            var historyList = external.historyManager.history();

            var element = h('div', {}, [h('h3', 'History List (' + historyList.total + ')'), h('ol', {}, historyList.items.map(function (i) {
                return h('li', i.command);
            }).toArray())]);

            robot.spawnCard(element);
        });

        robot.listen(/^clear history$/, "Clear the history list.", function (res) {
            external.historyManager.clear();

            robot.spawnCard(h('p', 'Cleared the history!'));
        });
    };
};