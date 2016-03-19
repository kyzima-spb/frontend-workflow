'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();


module.exports = function (config) {
    return function () {
        let format = config.notify.error,
            target = gulp.src(config.images.src, {
                since: gulp.lastRun(config.taskName)
            });
        
        return target
            .pipe($.plumber({
                errorHandler: $.notify.onError(format)
            }))
            .pipe($.newer(config.images.dest))
            .pipe($.imagemin(config.images.imagemin))
            .pipe(gulp.dest(config.images.dest))
        ;
    }
};
