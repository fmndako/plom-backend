'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "userId" on table "Loans"
 * changeColumn "userId" on table "Loans"
 * changeColumn "lender" on table "Loans"
 * changeColumn "lender" on table "Loans"
 *
 **/

var info = {
    "revision": 4,
    "name": "noname",
    "created": "2021-05-03T22:34:41.259Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "changeColumn",
            params: [
                "Loans",
                "userId",
                {
                    "type": Sequelize.UUID,
                    "unique": "Loans_userId_lender_unique",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "allowNull": true,
                    "field": "userId",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "foreignKey": true
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "Loans",
                "userId",
                {
                    "type": Sequelize.UUID,
                    "unique": "Loans_userId_lender_unique",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "allowNull": true,
                    "field": "userId",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "foreignKey": true
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "Loans",
                "lender",
                {
                    "type": Sequelize.UUID,
                    "unique": "Loans_userId_lender_unique",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "allowNull": true,
                    "field": "lender",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "foreignKey": true
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "Loans",
                "lender",
                {
                    "type": Sequelize.UUID,
                    "unique": "Loans_userId_lender_unique",
                    "onUpdate": "CASCADE",
                    "onDelete": "CASCADE",
                    "allowNull": true,
                    "field": "lender",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "foreignKey": true
                },
                {
                    transaction: transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "changeColumn",
            params: [
                "Loans",
                "userId",
                {
                    "type": Sequelize.UUID,
                    "field": "userId",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "foreignKey": true
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "Loans",
                "userId",
                {
                    "type": Sequelize.UUID,
                    "field": "userId",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "foreignKey": true
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "Loans",
                "lender",
                {
                    "type": Sequelize.UUID,
                    "field": "lender",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "foreignKey": true
                },
                {
                    transaction: transaction
                }
            ]
        },
        {
            fn: "changeColumn",
            params: [
                "Loans",
                "lender",
                {
                    "type": Sequelize.UUID,
                    "field": "lender",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "foreignKey": true
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
        var index = this.pos;
        function run(transaction) {
            const commands = _commands(transaction);
            return new Promise(function(resolve, reject) {
                function next() {
                    if (index < commands.length)
                    {
                        let command = commands[index];
                        console.log("[#"+index+"] execute: " + command.fn);
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
