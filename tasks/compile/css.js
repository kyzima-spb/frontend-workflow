'use strict';

const _ = require('lodash');
const es = require('event-stream');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const poststylus = require('poststylus');
const browserSync = require('browser-sync');


module.exports = function (options, devMode) {
    function compile(config) {
        let processors = [
                // require('postcss-nested'),
                // require('postcss-clearfix')
            ];
        
        if (!devMode) {
            processors.push(require('postcss-csso')());
        }
        
        let stylusOptions = _.merge(config.stylus, {
                use: [
                    poststylus(processors)
                ]
            });
        
        return gulp.src(config.src)
            .pipe($.plumber({
                errorHandler: $.notify.onError(options.notify.error)
            }))
            .pipe($.stylus(stylusOptions))
            .pipe(gulp.dest(config.dest))
            .pipe(browserSync.reload({
                stream: true
            }));
    }

    return function (cb) {
        es.merge(options.css.map(compile)).on('end', cb);
    };
};
