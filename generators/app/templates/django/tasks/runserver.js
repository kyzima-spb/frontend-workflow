'use strict';

const exec = require('child_process').exec;


module.exports = function (config) {
    return function (done) {
        let isWin = /^win/.test(process.platform),
            expr = /Starting development server at http:\/\//gi,
            cmd = isWin
                ? `SET PYTHONUNBUFFERED=1 python ${config.manage} runserver ${config.host}:${config.port}`
                : `PYTHONUNBUFFERED=1 python ${config.manage} runserver ${config.host}:${config.port}`,
            proc = exec(cmd),
            runned = false;

        // @fixme: error not handled
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
