'use strict';

const _ = require('lodash');
const es = require('event-stream');
const buildBowerDependencies = require('../../utils/bower.js').buildBowerDependencies;


module.exports = function (options) {
    return function (cb) {
        es.merge(
            _.without(options.map(buildBowerDependencies), undefined)
        ).on('end', cb);
    }
};
