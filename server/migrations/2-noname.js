'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "lenderDeleted" to table "Loans"
 * addColumn "deleted" to table "Loans"
 *
 **/

let info = {
    'revision': 2,
    'name': 'noname',
    'created': '2021-09-06T07:00:37.711Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'addColumn',
        params: [
            'Loans',
            'lenderDeleted',
            {
                'type': Sequelize.BOOLEAN,
                'field': 'lenderDeleted',
                'defaultValue': false
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Loans',
            'deleted',
            {
                'type': Sequelize.BOOLEAN,
                'field': 'deleted',
                'defaultValue': false
            },
            {
                transaction: transaction
            }
        ]
    }
    ];
};
let rollbackCommands = function(transaction) {
    return [{
        fn: 'removeColumn',
        params: [
            'Loans',
            'lenderDeleted',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'deleted',
            {
                transaction: transaction
            }
        ]
    }
    ];
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
