"use strict"

const path = require('path');
const _ = require('lodash');

const Config = require('./utils/config.js');


const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
// const es = require('event-stream');
// const combine = require('stream-combiner2').obj;

// const through2 = require('through2').obj;

function lazyTask(name, path, options) {
    options = options || {};
    
    gulp.task(name, function (cb) {
        let task = require(path).call(this, options);
        return task(cb);
    });
}

let config = Config(path.resolve('./config.json'));

lazyTask('clean', './tasks/clean.js', config.clean);

lazyTask('wiredep', './tasks/wiredep.js', config.html);

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
