'use strict';

const path = require('path');
const _ = require('lodash');
const normalizeConfig = require('../../utils/bower.js').normalizeConfig;
const es = require('event-stream');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();


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
    
    return gulp.src(config.entries)
        .pipe(gulp.dest(config.dest))
        .pipe($.inject(assets, config.vendor.inject))
        
        .pipe(gulp.dest(config.dest))
    ;
}


module.exports = function (options) {
    return function (cb) {
        es.merge(options.map(buildHtml)).on('end', cb);
    }
};
