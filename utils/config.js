'use strict';

const path = require('path');
const _ = require('lodash');


module.exports = function (configPath) {
    try {
        var config = require(configPath);
    } catch (e) {
        return false;
    }
    
    config.env = process.env.NODE_ENV || config.env || 'development';
    config.isDev = config.env === 'development';
    
    if (config.isDev) {
        try {
            let dev = require(
                    path.join(
                        path.dirname(configPath),
                        `${path.basename(configPath, '.json')}-dev.json`
                    )
                );
            
            _.merge(config, dev, function (src, dest) {
                if (_.isArray(dest)) {
                    return dest;
                }
            });
        } catch (e) {}
    }
    
    let str = JSON.stringify(config),
        paths = config.paths;
    
    for (let path in paths) {
        let expr = new RegExp('@' + path, 'g');
        str = str.replace(expr, paths[path]);
    }
    
    return JSON.parse(str.replace(/\/+/g, '/'));
};
