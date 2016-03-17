"use strict";

const del = require('del');


module.exports = function (config) {
    return function (cb) {
        return del(config.patterns, config.options);
    }
};
