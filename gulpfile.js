"use strict"

const path = require('path');
const _ = require('lodash');

const Config = require('./utils/config.js');
const lazyTask = require('./utils/lazyTask.js').lazyTask;
const defineLazyTask = require('./utils/lazyTask.js').defineLazyTask;

const gulp = require('gulp');
// const through2 = require('through2').obj;

let config = Config(path.resolve('./config.json'));


defineLazyTask('browserSync', './tasks/browserSync.js', config.browserSync);

defineLazyTask('clean', './tasks/clean.js', config.clean);

defineLazyTask('wiredep', './tasks/wiredep.js', config.html);

defineLazyTask('compile:css', './tasks/compile/css.js', config.css);
defineLazyTask('compile:browserify', './tasks/compile/browserify.js', config.browserify);

gulp.task('watch', gulp.parallel([
    lazyTask('./tasks/watch.js', config.watch),
    'compile:browserify',
    'browserSync'
]));

defineLazyTask('build:bower', './tasks/build/bower.js', config.html);

defineLazyTask(
    'build:html',
    './tasks/build/html.js',
    _.merge({
        'bundles': config.html,
        'htmlmin': config.htmlmin
    })
);

gulp.task('build', gulp.series(['clean', 'build:bower', 'build:html']));

gulp.task('serve', gulp.series(['build', 'browserSync']));
