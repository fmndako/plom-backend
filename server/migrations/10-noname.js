'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "verifiedEmails" on table "Users"
 * changeColumn "verifiedNumbers" on table "Users"
 *
 **/

let info = {
    'revision': 10,
    'name': 'noname',
    'created': '2021-07-19T08:36:11.477Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'changeColumn',
        params: [
            'Users',
            'verifiedEmails',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'verifiedEmails',
                'defaultValue': []
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
                'defaultValue': [],
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
        fn: 'changeColumn',
        params: [
            'Users',
            'verifiedEmails',
            {
                'type': Sequelize.ARRAY(Sequelize.STRING),
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
                'type': Sequelize.ARRAY(Sequelize.STRING),
                'field': 'verifiedNumbers'
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
