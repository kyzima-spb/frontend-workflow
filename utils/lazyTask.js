'use strict';


function lazyTask(name, path, options) {
    options = options || {};
    
    gulp.task(name, function (cb) {
        let task = require(path).call(this, options);
        return task(cb);
    });
}


module.exports = lazyTask;
