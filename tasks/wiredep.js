'use strict';

const es = require('event-stream');
const wiredep = require('../utils/bower.js').wiredep;


module.exports = function (options) {
    return function (cb) {
        es.merge(options.map(wiredep)).on('end', cb);
    }
};
