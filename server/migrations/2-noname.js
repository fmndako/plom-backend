'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "guarantorEmails" from table "UserConfigs"
 * removeColumn "guarantorPhoneNumbers" from table "UserConfigs"
 * removeColumn "guarantorName" from table "UserConfigs"
 * addColumn "users" to table "Users"
 * addColumn "emails" to table "Users"
 * addColumn "guarantor" to table "UserConfigs"
 *
 **/

let info = {
    'revision': 2,
    'name': 'noname',
    'created': '2021-05-02T19:01:14.592Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'removeColumn',
        params: [
            'UserConfigs',
            'guarantorEmails',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'UserConfigs',
            'guarantorPhoneNumbers',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'UserConfigs',
            'guarantorName',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'Users',
            'users',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'users'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
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
        fn: 'addColumn',
        params: [
            'UserConfigs',
            'guarantor',
            {
                'type': Sequelize.UUID,
                'field': 'guarantor',
                'references': {
                    'model': 'Users',
                    'key': 'id'
                },
                'foreignKey': true
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
            'UserConfigs',
            'guarantor',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Users',
            'users',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Users',
            'emails',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'UserConfigs',
            'guarantorEmails',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'guarantorEmails'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'UserConfigs',
            'guarantorPhoneNumbers',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'guarantorPhoneNumbers'
            },
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'addColumn',
        params: [
            'UserConfigs',
            'guarantorName',
            {
                'type': Sequelize.STRING,
                'field': 'guarantorName'
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
