"use strict";

const del = require('del');


// gulp.task('clean:tmp', function (cb) {
//     del(config.paths.tmp, cb);
// });


module.exports = function (options) {
    return function (cb) {
        del(
            [
                '**/*', '!.git*', '!.svn*'
            ],
            {
                cwd: options.paths.build
            },
            cb
        );
    }
};
