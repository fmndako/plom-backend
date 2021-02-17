'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Loans", deps: []
 * createTable "Users", deps: []
 * createTable "Offsets", deps: [Loans]
 * createTable "Tokens", deps: [Users]
 *
 **/

var info = {
    "revision": 1,
    "name": "noname",
    "created": "2021-02-17T22:53:23.802Z",
    "comment": ""
};

var migrationCommands = function(transaction) {
    return [{
            fn: "createTable",
            params: [
                "Loans",
                {
                    "id": {
                        "type": Sequelize.UUID,
                        "field": "id",
                        "primaryKey": true,
                        "defaultValue": Sequelize.UUIDV1
                    },
                    "type": {
                        "type": Sequelize.STRING,
                        "field": "type",
                        "allowNull": false
                    },
                    "loanItem": {
                        "type": Sequelize.STRING,
                        "field": "loanItem"
                    },
                    "amount": {
                        "type": Sequelize.INTEGER,
                        "field": "amount"
                    },
                    "author": {
                        "type": Sequelize.INTEGER,
                        "field": "author"
                    },
                    "other": {
                        "type": Sequelize.INTEGER,
                        "field": "other"
                    },
                    "clearStatus": {
                        "type": Sequelize.BOOLEAN,
                        "field": "clearStatus"
                    },
                    "notify": {
                        "type": Sequelize.BOOLEAN,
                        "field": "notify"
                    },
                    "offset": {
                        "type": Sequelize.BOOLEAN,
                        "field": "offset"
                    },
                    "dateTaken": {
                        "type": Sequelize.DATE,
                        "field": "dateTaken"
                    },
                    "dateToRepay": {
                        "type": Sequelize.DATE,
                        "field": "dateToRepay"
                    },
                    "dateCleared": {
                        "type": Sequelize.DATE,
                        "field": "dateCleared"
                    },
                    "remarks": {
                        "type": Sequelize.STRING,
                        "field": "remarks"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "Users",
                {
                    "id": {
                        "type": Sequelize.UUID,
                        "field": "id",
                        "primaryKey": true,
                        "defaultValue": Sequelize.UUIDV1
                    },
                    "email": {
                        "type": Sequelize.STRING,
                        "field": "email"
                    },
                    "firstName": {
                        "type": Sequelize.STRING,
                        "field": "firstName"
                    },
                    "middleName": {
                        "type": Sequelize.STRING,
                        "field": "middleName"
                    },
                    "lastName": {
                        "type": Sequelize.STRING,
                        "field": "lastName"
                    },
                    "dateOfBirth": {
                        "type": Sequelize.DATE,
                        "field": "dateOfBirth"
                    },
                    "username": {
                        "type": Sequelize.STRING,
                        "field": "username"
                    },
                    "salutation": {
                        "type": Sequelize.STRING,
                        "field": "salutation"
                    },
                    "isAdmin": {
                        "type": Sequelize.BOOLEAN,
                        "field": "isAdmin",
                        "defaultValue": 0
                    },
                    "isSuperadmin": {
                        "type": Sequelize.BOOLEAN,
                        "field": "isSuperadmin",
                        "defaultValue": 0
                    },
                    "deleted": {
                        "type": Sequelize.BOOLEAN,
                        "field": "deleted",
                        "defaultValue": 0
                    },
                    "dateDeleted": {
                        "type": Sequelize.DATE,
                        "field": "dateDeleted"
                    },
                    "gender": {
                        "type": Sequelize.STRING,
                        "field": "gender"
                    },
                    "address": {
                        "type": Sequelize.STRING,
                        "field": "address"
                    },
                    "maritalStatus": {
                        "type": Sequelize.STRING,
                        "field": "maritalStatus"
                    },
                    "acceptedTerms": {
                        "type": Sequelize.BOOLEAN,
                        "field": "acceptedTerms",
                        "defaultValue": 0
                    },
                    "phoneNumber": {
                        "type": Sequelize.STRING,
                        "field": "phoneNumber"
                    },
                    "businessName": {
                        "type": Sequelize.STRING,
                        "field": "businessName"
                    },
                    "accountType": {
                        "type": Sequelize.STRING,
                        "field": "accountType"
                    },
                    "organization": {
                        "type": Sequelize.STRING,
                        "field": "organization"
                    },
                    "bussinessAddress": {
                        "type": Sequelize.STRING,
                        "field": "bussinessAddress"
                    },
                    "bvn": {
                        "type": Sequelize.STRING,
                        "field": "bvn"
                    },
                    "description": {
                        "type": Sequelize.STRING,
                        "field": "description"
                    },
                    "designation": {
                        "type": Sequelize.STRING,
                        "field": "designation"
                    },
                    "token": {
                        "type": Sequelize.STRING,
                        "field": "token"
                    },
                    "tokenCreatedAt": {
                        "type": Sequelize.DATE,
                        "field": "tokenCreatedAt"
                    },
                    "attemptCount": {
                        "type": Sequelize.INTEGER,
                        "field": "attemptCount"
                    },
                    "timeLocked": {
                        "type": Sequelize.DATE,
                        "field": "timeLocked"
                    },
                    "accountLocked": {
                        "type": Sequelize.BOOLEAN,
                        "field": "accountLocked"
                    },
                    "loginMethod": {
                        "type": Sequelize.STRING,
                        "field": "loginMethod",
                        "defaultValue": "email"
                    },
                    "status": {
                        "type": Sequelize.STRING,
                        "field": "status",
                        "defaultValue": "inactive"
                    },
                    "isActive": {
                        "type": Sequelize.BOOLEAN,
                        "field": "isActive",
                        "defaultValue": 0
                    },
                    "dateCreated": {
                        "type": Sequelize.DATE,
                        "field": "dateCreated",
                        "defaultValue": Sequelize.NOW
                    },
                    "lastLogin": {
                        "type": Sequelize.DATE,
                        "field": "lastLogin"
                    },
                    "password": {
                        "type": Sequelize.STRING,
                        "field": "password",
                        "allowNULL": false
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "Offsets",
                {
                    "id": {
                        "type": Sequelize.UUID,
                        "field": "id",
                        "primaryKey": true,
                        "defaultValue": Sequelize.UUIDV1
                    },
                    "amount": {
                        "type": Sequelize.INTEGER,
                        "field": "amount"
                    },
                    "date": {
                        "type": Sequelize.DATE,
                        "field": "date"
                    },
                    "remarks": {
                        "type": Sequelize.STRING,
                        "field": "remarks"
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "loanId": {
                        "type": Sequelize.UUID,
                        "field": "loanId",
                        "onUpdate": "CASCADE",
                        "onDelete": "SET NULL",
                        "references": {
                            "model": "Loans",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        },
        {
            fn: "createTable",
            params: [
                "Tokens",
                {
                    "id": {
                        "type": Sequelize.UUID,
                        "field": "id",
                        "primaryKey": true,
                        "defaultValue": Sequelize.UUIDV1
                    },
                    "token": {
                        "type": Sequelize.STRING,
                        "field": "token",
                        "allowNull": false
                    },
                    "dateCreated": {
                        "type": Sequelize.DATE,
                        "field": "dateCreated",
                        "defaultValue": Sequelize.NOW
                    },
                    "createdAt": {
                        "type": Sequelize.DATE,
                        "field": "createdAt",
                        "allowNull": false
                    },
                    "updatedAt": {
                        "type": Sequelize.DATE,
                        "field": "updatedAt",
                        "allowNull": false
                    },
                    "userId": {
                        "type": Sequelize.UUID,
                        "field": "userId",
                        "onUpdate": "CASCADE",
                        "onDelete": "CASCADE",
                        "references": {
                            "model": "Users",
                            "key": "id"
                        },
                        "allowNull": true
                    }
                },
                {
                    "transaction": transaction
                }
            ]
        }
    ];
};
var rollbackCommands = function(transaction) {
    return [{
            fn: "dropTable",
            params: ["Loans", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["Offsets", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["Tokens", {
                transaction: transaction
            }]
        },
        {
            fn: "dropTable",
            params: ["Users", {
                transaction: transaction
            }]
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
