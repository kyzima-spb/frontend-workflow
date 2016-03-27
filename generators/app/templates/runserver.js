'use strict';

const exec = require('child_process').exec;


module.exports = function (config) {
    return function (done) {
        let expr = /Starting development server at http:\/\//gi,
            proc = exec(`PYTHONUNBUFFERED=1 python ${config.manage} runserver ${config.host}:${config.port}`),
            runned = false;


        proc.stdout.on('data', function (data) {
            if (!runned) {
                if (expr.test(data)) {
                    runned = true;
                    done();
                }
            }
        });

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
    }
};
