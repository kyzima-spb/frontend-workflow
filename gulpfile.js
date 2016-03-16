"use strict"

const path = require('path');
const _ = require('lodash');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const mainBowerFiles = require('main-bower-files');
const es = require('event-stream');
const combine = require('stream-combiner2').obj;

// const through2 = require('through2').obj;

// const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

let cnf = [
    {
        "entries": ['./app/index.html'],
        "dest": "./dist",
        "vendor": {
        //     "outputCss": "./dist/vendor/css/vendor.css",
        //     "outputJs": "./dist/vendor/js/vendor.js"
            "inject": {
                relative: true
            }
        }
    },
    {
        "entries": ['./app/admin/admin.html'],
        "dest": "./dist/admin",
        "vendor": {
            "group": "admin",
            "outputCss": "./dist/vendor/css/admin.css",
            "outputJs": "./dist/vendor/js/admin.js",
            "inject": {
                relative: true
            }
        }
    },
    {
        "entries": ['./app/test.html'],
        "dest": "./dist",
        "vendor": {
            "group": "test",
            // "outputCss": "./dist/vendor/css/test.css",
            // "outputJs": "./dist/vendor/js/test.js"
        }
    }
    
    // {
    //     "entries": ['./app/**/*.html'],
    //     "dest": "./dist",
    //     // "vendor": {
    //     //     "outputCss": "./dist/vendor/css/vendor.css",
    //     //     "outputJs": "./dist/vendor/js/vendor.js",
    //     //     "inject": {
    //                 // relative: true,
    //     //     }
    //     // }
    // }
];


function lazyTask(name, path, options) {
    options = options || {};
    
    gulp.task(name, function (cb) {
        let task = require(path).call(this, options);
        return task(cb);
    });
}


lazyTask('wiredep', './tasks/wiredep.js', cnf);

lazyTask('build:bower', './tasks/build_tasks/bower.js', cnf);

lazyTask('build:html', './tasks/build_tasks/html.js', cnf);

gulp.task('build', gulp.series(['build:bower', 'build:html']));
