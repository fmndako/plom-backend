'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "cleared" on table "Loans"
 *
 **/

let info = {
    'revision': 7,
    'name': 'noname',
    'created': '2021-06-04T07:14:26.362Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'changeColumn',
        params: [
            'Loans',
            'cleared',
            {
                'type': Sequelize.BOOLEAN,
                'field': 'cleared',
                'defaultValue': false
            },
            {
                transaction: transaction
            }
        ]
    }];
};
let rollbackCommands = function(transaction) {
    return [{
        fn: 'changeColumn',
        params: [
            'Loans',
            'cleared',
            {
                'type': Sequelize.BOOLEAN,
                'field': 'cleared'
            },
            {
                transaction: transaction
            }
        ]
    }];
};

module.exports = {
    pos: 0,
    useTransaction: true,
    execute: function(queryInterface, Sequelize, _commands)
    {
        let index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log('[#'+index+'] execute: ' + command.fn);
                        index++;
                        queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                    }
                    else
                        resolve();
                }
                next();
            });
        }
        if (this.useTransaction) {
            return queryInterface.sequelize.transaction(run);
        } else {
            return run(null);
        }
    },
    up: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, migrationCommands);
    },
    down: function(queryInterface, Sequelize)
    {
        return this.execute(queryInterface, Sequelize, rollbackCommands);
    },
    info: info
};
