'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');


module.exports = function (config) {
    return function () {
        let target = gulp.src(config.src + '.' + config.ext, {
                since: gulp.lastRun(config.taskName),
                read: false
            });
        
        return target
            .pipe($.newer(config.dest))
            .pipe(gulp.dest(config.dest))
            .pipe(browserSync.reload({
                stream: true
            }))
        ;
    }
};
