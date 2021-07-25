'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "notify" from table "Loans"
 * addColumn "userCleared" to table "Loans"
 * addColumn "lenderCleared" to table "Loans"
 * addColumn "userNotification" to table "Loans"
 * addColumn "lenderNotification" to table "Loans"
 * addColumn "isRepaymentOption" to table "Offsets"
 *
 **/

let info = {
    'revision': 12,
    'name': 'noname',
    'created': '2021-07-24T13:43:04.774Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'removeColumn',
        params: [
            'Loans',
            'notify',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Loans',
            'userCleared',
            {
                'type': Sequelize.JSONB,
                'field': 'userCleared'
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
            'lenderCleared',
            {
                'type': Sequelize.JSONB,
                'field': 'lenderCleared'
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
            'userNotification',
            {
                'type': Sequelize.JSONB,
                'field': 'userNotification'
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
            'lenderNotification',
            {
                'type': Sequelize.JSONB,
                'field': 'lenderNotification'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Offsets',
            'isRepaymentOption',
            {
                'type': Sequelize.BOOLEAN,
                'field': 'isRepaymentOption',
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
            'userCleared',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'lenderCleared',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'userNotification',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'lenderNotification',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Offsets',
            'isRepaymentOption',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Loans',
            'notify',
            {
                'type': Sequelize.BOOLEAN,
                'field': 'notify'
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
