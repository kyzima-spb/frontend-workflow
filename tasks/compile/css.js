'use strict';

const _ = require('lodash');
const es = require('event-stream');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const poststylus = require('poststylus');
const browserSync = require('browser-sync');

    
function compile(config) {
    let processors = [
            // require('postcss-nested'),
            // require('postcss-clearfix')
        ],
        stylusOptions = _.merge(config.stylus, {
            use: [
                poststylus(processors)
            ]
        });
    
    return gulp.src(config.src)
        .pipe($.plumber({
            errorHandler: $.notify.onError(function (err) {
                return {
                    title: 'Stylus',
                    mesage: err.message
                }
            })
        }))
        .pipe($.stylus(stylusOptions))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({
            stream: true
        }));
}


module.exports = function (config) {
    return function (cb) {
        es.merge(config.map(compile)).on('end', cb);
    };
};
