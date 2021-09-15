'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "options" from table "Loans"
 * removeColumn "repaymentOption" from table "Loans"
 * addColumn "repaymentOptions" to table "Loans"
 * addColumn "repaymentType" to table "Loans"
 * addColumn "dateToRepay" to table "Offsets"
 * addColumn "parent" to table "Offsets"
 * changeColumn "verifiedEmails" on table "Users"
 * changeColumn "verifiedNumbers" on table "Users"
 * changeColumn "emails" on table "Users"
 * changeColumn "numbers" on table "Users"
 *
 **/

let info = {
    'revision': 2,
    'name': 'noname',
    'created': '2021-09-15T06:59:13.346Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'removeColumn',
        params: [
            'Loans',
            'options',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'repaymentOption',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Loans',
            'repaymentOptions',
            {
                'type': Sequelize.JSONB,
                'field': 'repaymentOptions'
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
            'repaymentType',
            {
                'type': Sequelize.STRING,
                'field': 'repaymentType'
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
            'dateToRepay',
            {
                'type': Sequelize.DATE,
                'field': 'dateToRepay'
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
            'parent',
            {
                'type': Sequelize.UUID,
                'field': 'parent',
                'references': {
                    'model': 'Offsets',
                    'key': 'id'
                },
                'foreignKey': true
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'changeColumn',
        params: [
            'Users',
            'verifiedEmails',
            {
                'type': Sequelize.STRING,
                'field': 'verifiedEmails'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'changeColumn',
        params: [
            'Users',
            'verifiedNumbers',
            {
                'type': Sequelize.STRING,
                'field': 'verifiedNumbers'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'changeColumn',
        params: [
            'Users',
            'emails',
            {
                'type': Sequelize.STRING,
                'field': 'emails'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'changeColumn',
        params: [
            'Users',
            'numbers',
            {
                'type': Sequelize.STRING,
                'field': 'numbers'
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
            'repaymentOptions',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Loans',
            'repaymentType',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Offsets',
            'dateToRepay',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Offsets',
            'parent',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Loans',
            'options',
            {
                'type': Sequelize.JSONB,
                'field': 'options'
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
            'repaymentOption',
            {
                'type': Sequelize.STRING,
                'field': 'repaymentOption'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'changeColumn',
        params: [
            'Users',
            'verifiedEmails',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'verifiedEmails',
                'defaultValue': Sequelize.Array
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'changeColumn',
        params: [
            'Users',
            'verifiedNumbers',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'verifiedNumbers',
                'defaultValue': Sequelize.Array
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'changeColumn',
        params: [
            'Users',
            'emails',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'emails'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'changeColumn',
        params: [
            'Users',
            'numbers',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'numbers'
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
