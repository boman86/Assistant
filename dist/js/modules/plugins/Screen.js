"use strict";

module.exports = function (robot) {
    robot.listen(/^clear ?(screen)?$/, "Clear the screen", function (res) {
        robot.clearScreen();
    });
};