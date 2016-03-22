'use strict';

const browserifyTask = require('../../utils/browserifyTask.js');


module.exports = function (options, devMode) {
    return browserifyTask(options, devMode, false);
};
