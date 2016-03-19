'use strict';

const Config = require('./utils/config.js');
const lazyTask = require('./utils/lazyTask.js').lazyTask;
const defineLazyTask = require('./utils/lazyTask.js').defineLazyTask;

const gulp = require('gulp');


Config.load();

defineLazyTask('browserSync', './tasks/browserSync.js', Config.get('browserSync'));

defineLazyTask('clean', './tasks/clean.js', Config.get('clean'));

defineLazyTask('wiredep', './tasks/wiredep.js', Config.get('html'));

defineLazyTask('compile:css', './tasks/compile/css.js', Config.get('css'));
defineLazyTask('compile:browserify', './tasks/compile/browserify.js', Config.get('browserify'));

defineLazyTask('build:bower', './tasks/build/bower.js', Config.get('html'));
defineLazyTask('build:images', './tasks/build/images.js', Config.get(['images', 'notify'])); 
defineLazyTask('build:fonts', './tasks/build/fonts.js', Config.get('fonts'));
defineLazyTask('build:html', './tasks/build/html.js', Config.get(['html', 'htmlmin']));

gulp.task('compile', gulp.parallel([
    'compile:css', 'compile:browserify'
]));

gulp.task('build', gulp.series([
    'clean',
    gulp.parallel(['compile', 'build:images', 'build:fonts', 'build:bower']),
    'build:html'
]));

gulp.task('watch', gulp.parallel([
    lazyTask('./tasks/watch.js', Config.get('watch')),
    'compile:browserify',
    'browserSync'
]));

gulp.task('serve', gulp.series(['build', 'browserSync']));

gulp.task('default', gulp.series(['compile', 'watch']));
