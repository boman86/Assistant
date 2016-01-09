"use strict";

module.exports = {
    name: "Burp",
    description: "Buuuuurp.",

    run: function run(plugin) {
        plugin.listen(/burp/, function (res) {
            alert("BUUUUUUUUURP");
        });
    }
};