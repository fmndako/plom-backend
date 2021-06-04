'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Users", deps: []
 * createTable "Loans", deps: [Users, Users]
 * createTable "Offsets", deps: [Loans]
 * createTable "Tokens", deps: [Users]
 * createTable "UserConfigs", deps: [Users]
 *
 **/

let info = {
    'revision': 1,
    'name': 'noname',
    'created': '2021-05-02T17:40:53.498Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'createTable',
        params: [
            'Users',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'email': {
                    'type': Sequelize.STRING,
                    'field': 'email'
                },
                'firstName': {
                    'type': Sequelize.STRING,
                    'field': 'firstName'
                },
                'middleName': {
                    'type': Sequelize.STRING,
                    'field': 'middleName'
                },
                'lastName': {
                    'type': Sequelize.STRING,
                    'field': 'lastName'
                },
                'dateOfBirth': {
                    'type': Sequelize.DATE,
                    'field': 'dateOfBirth'
                },
                'username': {
                    'type': Sequelize.STRING,
                    'field': 'username'
                },
                'salutation': {
                    'type': Sequelize.STRING,
                    'field': 'salutation'
                },
                'isAdmin': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'isAdmin',
                    'defaultValue': false
                },
                'isSuperadmin': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'isSuperadmin',
                    'defaultValue': false
                },
                'deleted': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'deleted',
                    'defaultValue': false
                },
                'dateDeleted': {
                    'type': Sequelize.DATE,
                    'field': 'dateDeleted'
                },
                'gender': {
                    'type': Sequelize.STRING,
                    'field': 'gender'
                },
                'address': {
                    'type': Sequelize.STRING,
                    'field': 'address'
                },
                'maritalStatus': {
                    'type': Sequelize.STRING,
                    'field': 'maritalStatus'
                },
                'acceptedTerms': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'acceptedTerms',
                    'defaultValue': false
                },
                'numbers': {
                    'type': Sequelize.ARRAY(Sequelize.STRING),
                    'field': 'numbers'
                },
                'phoneNumber': {
                    'type': Sequelize.STRING,
                    'field': 'phoneNumber'
                },
                'businessName': {
                    'type': Sequelize.STRING,
                    'field': 'businessName'
                },
                'accountType': {
                    'type': Sequelize.STRING,
                    'field': 'accountType'
                },
                'organization': {
                    'type': Sequelize.STRING,
                    'field': 'organization'
                },
                'bussinessAddress': {
                    'type': Sequelize.STRING,
                    'field': 'bussinessAddress'
                },
                'bvn': {
                    'type': Sequelize.STRING,
                    'field': 'bvn'
                },
                'description': {
                    'type': Sequelize.STRING,
                    'field': 'description'
                },
                'designation': {
                    'type': Sequelize.STRING,
                    'field': 'designation'
                },
                'token': {
                    'type': Sequelize.STRING,
                    'field': 'token'
                },
                'tokenCreatedAt': {
                    'type': Sequelize.DATE,
                    'field': 'tokenCreatedAt'
                },
                'attemptCount': {
                    'type': Sequelize.INTEGER,
                    'field': 'attemptCount'
                },
                'timeLocked': {
                    'type': Sequelize.DATE,
                    'field': 'timeLocked'
                },
                'accountLocked': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'accountLocked'
                },
                'loginMethod': {
                    'type': Sequelize.STRING,
                    'field': 'loginMethod',
                    'defaultValue': 'email'
                },
                'status': {
                    'type': Sequelize.STRING,
                    'field': 'status',
                    'defaultValue': 'inactive'
                },
                'isActive': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'isActive',
                    'defaultValue': false
                },
                'dateCreated': {
                    'type': Sequelize.DATE,
                    'field': 'dateCreated',
                    'defaultValue': Sequelize.NOW
                },
                'lastLogin': {
                    'type': Sequelize.DATE,
                    'field': 'lastLogin'
                },
                'createdBySelf': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'createdBySelf',
                    'defaultValue': true
                },
                'password': {
                    'type': Sequelize.STRING,
                    'field': 'password',
                    'allowNULL': false
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
    },
    {
        fn: 'createTable',
        params: [
            'Loans',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'type': {
                    'type': Sequelize.STRING,
                    'field': 'type',
                    'allowNull': false
                },
                'lender': {
                    'type': Sequelize.UUID,
                    'field': 'lender',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'foreignKey': true
                },
                'userId': {
                    'type': Sequelize.UUID,
                    'field': 'userId',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'foreignKey': true
                },
                'loanItem': {
                    'type': Sequelize.STRING,
                    'field': 'loanItem'
                },
                'amount': {
                    'type': Sequelize.INTEGER,
                    'field': 'amount'
                },
                'cleared': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'cleared'
                },
                'notify': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'notify'
                },
                'dateTaken': {
                    'type': Sequelize.DATE,
                    'field': 'dateTaken'
                },
                'dateToRepay': {
                    'type': Sequelize.DATE,
                    'field': 'dateToRepay'
                },
                'dateCleared': {
                    'type': Sequelize.DATE,
                    'field': 'dateCleared'
                },
                'repaymentOptions': {
                    'type': Sequelize.STRING,
                    'field': 'repaymentOptions'
                },
                'remarks': {
                    'type': Sequelize.STRING,
                    'field': 'remarks'
                },
                'deleted': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'deleted',
                    'defaultValue': false
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
    },
    {
        fn: 'createTable',
        params: [
            'Offsets',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'loanId': {
                    'type': Sequelize.UUID,
                    'onUpdate': 'CASCADE',
                    'onDelete': 'CASCADE',
                    'allowNull': true,
                    'field': 'loanId',
                    'references': {
                        'model': 'Loans',
                        'key': 'id'
                    },
                    'foreignKey': true
                },
                'amount': {
                    'type': Sequelize.INTEGER,
                    'field': 'amount'
                },
                'date': {
                    'type': Sequelize.DATE,
                    'field': 'date'
                },
                'remarks': {
                    'type': Sequelize.STRING,
                    'field': 'remarks'
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
    },
    {
        fn: 'createTable',
        params: [
            'Tokens',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'token': {
                    'type': Sequelize.STRING,
                    'field': 'token',
                    'allowNull': false
                },
                'type': {
                    'type': Sequelize.STRING,
                    'field': 'type'
                },
                'verified': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'verified'
                },
                'dateCreated': {
                    'type': Sequelize.DATE,
                    'field': 'dateCreated',
                    'defaultValue': Sequelize.NOW
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
                },
                'userId': {
                    'type': Sequelize.UUID,
                    'field': 'userId',
                    'onUpdate': 'CASCADE',
                    'onDelete': 'CASCADE',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'allowNull': true
                }
            },
            {
                'transaction': transaction
            }
        ]
    },
    {
        fn: 'createTable',
        params: [
            'UserConfigs',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
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
                'reminderDays': {
                    'type': Sequelize.INTEGER,
                    'field': 'reminderDays',
                    'defaultValue': 7
                },
                'currency': {
                    'type': Sequelize.STRING,
                    'field': 'currency'
                },
                'notification': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'notification',
                    'defaultValue': true
                },
                'guarantorName': {
                    'type': Sequelize.STRING,
                    'field': 'guarantorName'
                },
                'guarantorPhoneNumbers': {
                    'type': Sequelize.ARRAY(Sequelize.STRING),
                    'field': 'guarantorPhoneNumbers'
                },
                'guarantorEmails': {
                    'type': Sequelize.ARRAY(Sequelize.STRING),
                    'field': 'guarantorEmails'
                },
                'acceptedInactiveDays': {
                    'type': Sequelize.INTEGER,
                    'field': 'acceptedInactiveDays',
                    'defaultValue': 30
                },
                'sendDetailsToGuarantor': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'sendDetailsToGuarantor',
                    'defaultValue': true
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
    }
    ];
};
let rollbackCommands = function(transaction) {
    return [{
        fn: 'dropTable',
        params: ['Loans', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['Offsets', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['Tokens', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['UserConfigs', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['Users', {
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
