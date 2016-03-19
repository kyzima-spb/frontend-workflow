'use strict';

const Path = require('path');
const gulp = require('gulp');

const Config = require('./config.js');


function lazyTask(path, options) {
    options = options || {};
    
    return function (cb) {
        let task = require(Path.resolve(path)).call(this, options, Config.isDev());
        return task(cb);
    };
}


function defineLazyTask(name, path, options) {
    options = options || {};
    options.taskName = name;
    
    // path = Path.join(process.cwd(), 'tasks', name.split(':').join(Path.sep)) + '.js';
    gulp.task(name, lazyTask(path, options));
}


module.exports = {
    lazyTask: lazyTask,
    defineLazyTask: defineLazyTask
};
