'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');


module.exports = function (config, devMode) {
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
            .pipe($.if(!devMode, $.imagemin(config.images.imagemin)))
            .pipe(gulp.dest(config.images.dest))
            .pipe(browserSync.reload({
                stream: true
            }))
        ;
    }
};
