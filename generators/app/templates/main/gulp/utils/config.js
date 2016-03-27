'use strict';

const path = require('path');
const _ = require('lodash');


let params = {};


function get(name, def) {
    let res = _.isArray(name) ? _.pick(params, name) : params[name];
    return !_.isEmpty(res) ? res : def;
}


function isDev() {
    return get('env', 'development') === 'development';
}


function load(configPath) {
    configPath = configPath || path.join(process.cwd(), 'config.json');
    
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
    
    return params = JSON.parse(str.replace(/\/+/g, '/'));
}


module.exports = {
    get: get,
    isDev: isDev,
    load: load
};
