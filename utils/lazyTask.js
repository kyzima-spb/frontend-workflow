'use strict';

const Path = require('path');
const gulp = require('gulp');


function lazyTask(name, path, options, tasks) {
    function handler(cb) {
        let task = require(Path.resolve(path)).call(this, options, true);
        return task(cb);
    }
    
    options = options || {};
    
    tasks ? gulp.task(name, tasks, handler) : gulp.task(name, handler);
}


module.exports = lazyTask;
