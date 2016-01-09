'use strict';

module.exports = function (external) {
    return function (robot) {
        var h = robot.h;

        robot.listen(/help/, "Show a list of all available commands", function (res) {
            var pluginList = external.pluginManager.list();

            var element = h('div', {}, [h('h3', 'Help'), h('dl', pluginList.map(function (i) {
                return h('di', h('dt', i.name), h('dd', i.commands.map(function (c) {
                    return h('li', [h('span', c.name), h('span', ' - '), h('span', c.description)]);
                }).toArray()));
            }).toArray())]);

            robot.spawnCard(element);
        });
    };
};