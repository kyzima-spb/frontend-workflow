'use strict';

const browserSync = require('browser-sync');


module.exports = function (config) {
    return function (cb) {
        browserSync.init(config);
    };
};
