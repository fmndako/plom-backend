'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "approvalType" from table "Loans"
 * removeColumn "requested" from table "Loans"
 * addColumn "approvalStatus" to table "Loans"
 *
 **/

let info = {
    'revision': 13,
    'name': 'noname',
    'created': '2021-07-24T21:15:03.738Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'removeColumn',
        params: [
            'Loans',
            'approvalType',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'requested',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Loans',
            'approvalStatus',
            {
                'type': Sequelize.STRING,
                'field': 'approvalStatus'
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
            'approvalStatus',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Loans',
            'approvalType',
            {
                'type': Sequelize.STRING,
                'field': 'approvalType'
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
            'requested',
            {
                'type': Sequelize.BOOLEAN,
                'field': 'requested',
                'defaultValue': false
            },
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
