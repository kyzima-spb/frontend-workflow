'use strict';

const _ = require('lodash');

const es = require('event-stream');
const wiredep = require('../utils/bower.js').wiredep;


module.exports = function (options, devMode) {
    let wiredepOptions = options.wiredep || {};
    wiredepOptions.includeDev = devMode;
    
    return function (cb) {
        function handler(config) {
            _.merge(config, {
                wiredep: wiredepOptions
            });
            
            return wiredep(config);
        }
        
        es.merge(options.html.map(handler)).on('end', cb);
    }
};
