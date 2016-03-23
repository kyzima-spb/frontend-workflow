'use strict';

const exec = require('child_process').exec;


module.exports = function (config) {
    return function (done) {
        let proc = exec(`PYTHONUNBUFFERED=1 python ${config.manage} runserver`);

        if (config.stdout) {
            proc.stdout.on('data', function (data) {
                process.stdout.write(data);
            });
        }

        if (config.stderr) {
            proc.stderr.on('data', function (data) {
                process.stdout.write(data);
            });
        }
        
        setTimeout(done, 1000);
        // done();
    }
};
