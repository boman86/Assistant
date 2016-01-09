"use strict";

module.exports = function (robot) {
    var h = robot.h;

    robot.listen(/^clear ?(screen)?$/, "Clear the screen", function (res) {
        robot.clearScreen();
    });
};