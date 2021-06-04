'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "ActivityLogs", deps: [Users]
 *
 **/

let info = {
    'revision': 6,
    'name': 'noname',
    'created': '2021-06-03T07:17:55.996Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'createTable',
        params: [
            'ActivityLogs',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'level': {
                    'type': Sequelize.STRING,
                    'field': 'level',
                    'allowNull': false
                },
                'objectId': {
                    'type': Sequelize.UUID,
                    'field': 'objectId'
                },
                'userId': {
                    'type': Sequelize.UUID,
                    'onUpdate': 'CASCADE',
                    'onDelete': 'CASCADE',
                    'allowNull': true,
                    'field': 'userId',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'foreignKey': true
                },
                'error': {
                    'type': Sequelize.JSONB,
                    'field': 'error'
                },
                'status': {
                    'type': Sequelize.STRING,
                    'field': 'status'
                },
                'action': {
                    'type': Sequelize.STRING,
                    'field': 'action'
                },
                'category': {
                    'type': Sequelize.STRING,
                    'field': 'category'
                },
                'type': {
                    'type': Sequelize.STRING,
                    'field': 'type'
                },
                'message': {
                    'type': Sequelize.STRING,
                    'field': 'message'
                },
                'createdAt': {
                    'type': Sequelize.DATE,
                    'field': 'createdAt',
                    'allowNull': false
                },
                'updatedAt': {
                    'type': Sequelize.DATE,
                    'field': 'updatedAt',
                    'allowNull': false
                }
            },
            {
                'transaction': transaction
            }
        ]
    }];
};
let rollbackCommands = function(transaction) {
    return [{
        fn: 'dropTable',
        params: ['ActivityLogs', {
            transaction: transaction
        }]
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
