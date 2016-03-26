'use strict';

const path = require('path');
const _ = require('lodash');
const normalizeConfig = require('../../utils/bower.js').normalizeConfig;
const es = require('event-stream');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync');


module.exports = function (options, devMode) {
    function buildHtml(config) {
        config = normalizeConfig(config);
            
        let assets = gulp.src(
                [
                    config.vendor.outputCss,
                    config.vendor.outputJs
                ],
                {
                    read: false,
                    allowEmpty: true
                }
            );
            
        config.vendor.inject.ignorePath = _.concat(
            config.vendor.inject.ignorePath,
            path.normalize(config.dest).split('/')
        );
        
        let staticPath = {
                regexp: /(href|src)=(["'])(?!(http|https|\/\/))([^"']+)\2/gi,
                replace: '$1="{% static \'$4\' %}"'
            };
        
        return gulp.src(config.entries)
            .pipe(gulp.dest(config.dest))
            .pipe($.inject(assets, config.vendor.inject))
            .pipe($.replace(staticPath.regexp, staticPath.replace))
            .pipe($.htmlmin(options.htmlmin))
            .pipe(gulp.dest(config.dest))
        ;
    }
    
    
    function copyHtml(config) {
        return gulp.src(config.entries, { since: gulp.lastRun(options.taskName) })
            .pipe($.newer(config.dest))
            .pipe(gulp.dest(config.dest))
            .pipe(browserSync.reload({
                stream: true
            }))
        ;
    }
    

    return function (cb) {
        let handler = devMode ? copyHtml : buildHtml;
        es.merge(options.html.map(handler)).on('end', cb);
    }
};
