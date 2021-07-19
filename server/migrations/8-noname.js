'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "verifiedEmails" to table "Users"
 * addColumn "verifiedNumbers" to table "Users"
 *
 **/

let info = {
    'revision': 8,
    'name': 'noname',
    'created': '2021-07-18T16:20:07.800Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'addColumn',
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
        fn: 'addColumn',
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
let rollbackCommands = function(transaction) {
    return [{
        fn: 'removeColumn',
        params: [
            'Users',
            'verifiedEmails',
            {
                transaction: transaction
            }
        ]
    },
    {
        fn: 'removeColumn',
        params: [
            'Users',
            'verifiedNumbers',
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
