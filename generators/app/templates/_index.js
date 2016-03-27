'use strict';

const Config = require('./utils/config.js');
const lazyTask = require('./utils/lazyTask.js').lazyTask;
const defineLazyTask = require('./utils/lazyTask.js').defineLazyTask;

const gulp = require('gulp');


Config.load();

<% if (hasDjango) { %>defineLazyTask('runserver', './gulp/tasks/runserver.js', Config.get('django'));<% } %>

defineLazyTask('browserSync', './gulp/tasks/browserSync.js', Config.get('browserSync'));

defineLazyTask('clean', './gulp/tasks/clean.js', Config.get('clean'));

defineLazyTask('wiredep', './gulp/tasks/wiredep.js', Config.get(['html', 'wiredep']));

defineLazyTask('compile:css', './gulp/tasks/compile/css.js', Config.get(['css', 'notify']));
defineLazyTask('compile:browserify', './gulp/tasks/compile/browserify.js', Config.get(['browserify', 'notify']));

defineLazyTask('build:bower', './gulp/tasks/build/bower.js', Config.get('html'));
defineLazyTask('build:images', './gulp/tasks/build/images.js', Config.get(['images', 'notify'])); 
defineLazyTask('build:fonts', './gulp/tasks/build/fonts.js', Config.get('fonts'));
defineLazyTask('build:html', './gulp/tasks/build/html.js', Config.get(['html', 'htmlmin']));


gulp.task('watch', gulp.parallel([
    lazyTask('./gulp/tasks/watch.js', Config.get('watch')),
    lazyTask('./gulp/tasks/watchify.js', Config.get(['browserify', 'notify']))
]));


gulp.task('default', gulp.series([
    'clean',
    'wiredep',
    gulp.parallel([
        'compile:css',
        'build:images',
        'build:fonts',
        'build:html'
    ]),
    'watch',
    <% if (hasDjango) { %>'runserver',<% } %>
    'browserSync'
]));


gulp.task('build', gulp.series([
    'clean',
    gulp.parallel([
        'compile:css',
        'compile:browserify',
        'build:images',
        'build:fonts',
        'build:bower'
    ]),
    'build:html'
]));
