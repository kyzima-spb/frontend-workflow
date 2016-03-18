'use strict';

const Path = require('path');
const gulp = require('gulp');


function lazyTask(name, path, options) {
    options = options || {};
    
    gulp.task(name, function (cb) {
        let task = require(Path.resolve(path)).call(this, options);
        return task(cb);
    });
}


module.exports = lazyTask;
