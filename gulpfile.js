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


gulp.task('wiredep', function (cb) {
    function wiredepThis(config) {
        config = normalizeConfig(config);
        
        let assets = mainBowerFiles({
                group: config.vendor.group
            });
        
        if (!assets.length) {
            return gulp.src(config.entries)
                .pipe(gulp.dest(config.dest))
            ;
        }
        
        assets = gulp.src(assets, { read: false });
        
        return gulp.src(config.entries)
            .pipe($.inject(assets, { name: config.vendor.inject.name }))
            .pipe(gulp.dest(config.dest))
        ;
    }
    
    es.merge(cnf.map(wiredepThis)).on('end', cb);
});



gulp.task('build:bower', function (cb) {
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
                })
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
                $.csso(),
                gulp.dest(path.dirname(outputCss))
            )))
            .pipe($.if('*.js', combine(
                $.concat(path.basename(outputJs)),
                $.uglify(),
                gulp.dest(path.dirname(outputJs))
            )))
        ;
    }
    
    es.merge(
        _.without(cnf.map(buildBowerDependencies), undefined)
    ).on('end', cb);
});


gulp.task('build:html', function (cb) {
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
    
    es.merge(cnf.map(buildHtml)).on('end', cb);
});


gulp.task('build', gulp.series(['build:bower', 'build:html']));
