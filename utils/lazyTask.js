'use strict';

const Path = require('path');
const gulp = require('gulp');


function lazyTask(path, options) {
    options = options || {};
    
    return function (cb) {
        let task = require(Path.resolve(path)).call(this, options, true);
        return task(cb);
    };
}


function defineLazyTask(name, path, options) {
    // path = Path.join(process.cwd(), 'tasks', name.split(':').join(Path.sep)) + '.js';
    gulp.task(name, lazyTask(path, options));
}


module.exports = {
    lazyTask: lazyTask,
    defineLazyTask: defineLazyTask
};
