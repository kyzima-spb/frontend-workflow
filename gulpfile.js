"use strict"

const path = require('path');
const _ = require('lodash');

const Config = require('./utils/config.js');
const lazyTask = require('./utils/lazyTask.js');

const gulp = require('gulp');
// const through2 = require('through2').obj;

let config = Config(path.resolve('./config.json'));


lazyTask('browserSync', './tasks/browserSync.js', config.browserSync);

lazyTask('watch', './tasks/watch.js', config.watch);

lazyTask('clean', './tasks/clean.js', config.clean);

lazyTask('wiredep', './tasks/wiredep.js', config.html);

lazyTask('compile:css', './tasks/compile_tasks/css.js', config.css);

lazyTask('build:bower', './tasks/build_tasks/bower.js', config.html);

lazyTask(
    'build:html',
    './tasks/build_tasks/html.js',
    _.merge({
        'bundles': config.html,
        'htmlmin': config.htmlmin
    })
);

gulp.task('build', gulp.series(['clean', 'build:bower', 'build:html']));

gulp.task('serve', gulp.series(['build', 'browserSync']));

// gulp.task('watch', ['watchify', 'browserSync'], function () {
    
// });