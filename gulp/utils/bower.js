'use strict';

const path = require('path');
const _ = require('lodash');
const es = require('event-stream');
const combine = require('stream-combiner2').obj;

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const mainBowerFiles = require('main-bower-files');


function buildBowerDependencies(config) {
    config = normalizeConfig(config);
    
    let outputCss = config.vendor.outputCss,
        outputJs = config.vendor.outputJs, 
        assets = mainBowerFiles({
            group: config.vendor.group
        }),
        processors = [
            require('postcss-assets-rebase')({
                assetsPath: '../assets',
                relative: true,
                renameDuplicates: true
            }),
            require('postcss-csso')()
        ];
    
    if (!assets.length) {
        return;
    }
    
    return gulp.src(assets)
        .pipe($.if('*.css', combine(
            $.postcss(processors, {
                to: outputCss
            }),
            $.concat(path.basename(outputCss)),
            // $.csso(),
            gulp.dest(path.dirname(outputCss))
        )))
        .pipe($.if('*.js', combine(
            $.concat(path.basename(outputJs)),
            $.uglify(),
            gulp.dest(path.dirname(outputJs))
        )))
    ;
}


function normalizeConfig(config) {
    config = _.merge(
        {
            vendor: {
                inject: {
                    ignorePath: []
                }
            }
        },
        config
    );
    
    let group = config.vendor.group || 'vendor';
    
    !config.vendor.outputCss && (config.vendor.outputCss = `${config.dest}/vendor/css/${group}.css`);
    !config.vendor.outputJs && (config.vendor.outputJs = `${config.dest}/vendor/js/${group}.js`);
    
    config.vendor.inject.name = group;
    
    return config;
}


function wiredep(config) {
    config = normalizeConfig(config);
    
    let target = gulp.src(config.entries/*, { since: gulp.lastRun(config.taskName) }*/),
        assets = mainBowerFiles({
            group: config.vendor.group,
            includeDev: config.wiredep.includeDev
        });
    
    if (!assets.length) {
        return target;
    }
    
    assets = gulp.src(assets, { read: false });
    config.wiredep.name = config.vendor.inject.name;
    
    return target
        .pipe($.inject(assets, config.wiredep))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }))
    ;
}


module.exports = {
    buildBowerDependencies: buildBowerDependencies,
    normalizeConfig: normalizeConfig,
    wiredep: wiredep
};
