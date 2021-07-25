'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "security" to table "Loans"
 * addColumn "urgency" to table "Loans"
 * addColumn "dateRequested" to table "Loans"
 * addColumn "approvalDate" to table "Loans"
 * addColumn "approvalType" to table "Loans"
 * addColumn "approvalComments" to table "Loans"
 * addColumn "requested" to table "Loans"
 *
 **/

let info = {
    'revision': 11,
    'name': 'noname',
    'created': '2021-07-24T13:31:53.065Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'addColumn',
        params: [
            'Loans',
            'security',
            {
                'type': Sequelize.STRING,
                'field': 'security'
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
            'urgency',
            {
                'type': Sequelize.STRING,
                'field': 'urgency'
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
            'dateRequested',
            {
                'type': Sequelize.DATE,
                'field': 'dateRequested'
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
            'approvalDate',
            {
                'type': Sequelize.DATE,
                'field': 'approvalDate'
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
            'approvalComments',
            {
                'type': Sequelize.STRING,
                'field': 'approvalComments'
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
let rollbackCommands = function(transaction) {
    return [{
        fn: 'removeColumn',
        params: [
            'Loans',
            'security',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'urgency',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'dateRequested',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'approvalDate',
            {
                transaction: transaction
            }
        ]
    },
    {
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
            'approvalComments',
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
