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
                    name: 'hasDjango',
                    message: 'Is Django?',
                    default: false,
                    when: function (answers) {
                        answers.hasDjango = false;
                        return this.fs.exists(this.destinationPath('manage.py'));
                    }.bind(this)
                },
                {
                    type: 'input',
                    name: 'django_host',
                    message: 'Enter a host that is running Django:',
                    default: 'localhost',
                    when: function (answers) {
                        return answers.hasDjango;
                    }
                },
                {
                    type: 'input',
                    name: 'django_port',
                    message: 'Enter a port that is running Django:',
                    default: '8000',
                    when: function (answers) {
                        return answers.hasDjango;
                    }
                },
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

        this.prompt(prompts, function (answers) {
            this.answers = answers;

            done();
        }.bind(this));
    },

    writing: {
        mainFiles: function () {
            this.directory('main', '.');
            
            if (this.answers.hasDjango) {
                this.copy('runserver.js', 'gulp/tasks/runserver.js');
            } else {
                this.directory('simple-app', 'app');
            }
            
            this.template('_index.js', 'gulp/index.js', this.answers);
        },
        
        configFiles: function () {
            let options = { delimiter: '$' },
                dir = this.answers.hasDjango ? 'django' : 'simple';
                
            this.template(`config/${dir}/_config.json`, 'config.json', this.answers, options);
            this.template(`config/${dir}/_config-dev.json`, 'config-dev.json', this.answers, options);
        },
        
        npm: function () {
            this.template('_package.json', 'package.json', {
                package_name: _.kebabCase(this.appname)
            });
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
        this.installDependencies();
    }
});
