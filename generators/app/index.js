'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

const _ = require('lodash');


module.exports = yeoman.generators.Base.extend({
    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the finest ' + chalk.red('generator-frontend-workflow') + ' generator!'
        ));

        let prompts = [
                {
                    type: 'confirm',
                    name: 'hasBootstrap',
                    message: 'You want to use a Bootstrap?',
                    default: false
                },
                {
                    type: 'confirm',
                    name: 'hasFontAwesome',
                    message: 'You want to use a Font-Awesome?',
                    default: false
                }
            ];
            
        //if (this.fs.exists(this.destinationPath('manage.py'))) {
            prompts.push({
                type: 'confirm',
                name: 'hasDjango',
                message: 'Is Django?',
                default: false
            });
        //}

        this.prompt(prompts, function (answers) {
            this.answers = answers;

            done();
        }.bind(this));
    },

    writing: {
        mainFiles: function () {
            this.directory('main', '.');
        },
        
        configFiles: function () {
            let context = _.pick(this.answers, ['hasDjango']),
                options = { delimiter: '$' };
            
            this.template('config/config.json', 'config.json', context, options);
            this.template('config/config-dev.json', 'config-dev.json', context, options);
        },
        
        bower: function () {
            let bowerJson = {
                    name: _.kebabCase(this.appname),
                    private: true,
                    dependencies: {},
                    overrides: {},
                    groups: {
                        vendor: []
                    }
                };
            
            if (this.answers.hasBootstrap) {
                bowerJson.dependencies['bootstrap'] = '^3';
                bowerJson.groups.vendor.push('bootstrap'); 
                bowerJson.overrides['bootstrap'] = {
                    main: [
                        './dist/css/bootstrap.min.css',
                        './dist/js/bootstrap.js'
                    ]
                };
            }
            
            if (this.answers.hasFontAwesome) {
                bowerJson.dependencies['font-awesome'] = '^4';
                bowerJson.groups.vendor.push('font-awesome');
                bowerJson.overrides['font-awesome'] = {
                    main: [
                        './css/font-awesome.min.css'
                    ]
                }
            }
    
            this.fs.writeJSON('bower.json', bowerJson);
        }
    },

    install: function () {
        this.installDependencies({
            npm: false
        });
    }
});
