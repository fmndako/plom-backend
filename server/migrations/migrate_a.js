'use strict';

let Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Emails", deps: []
 * createTable "Phones", deps: []
 * createTable "Users", deps: [Users]
 * createTable "ActivityLogs", deps: [Users]
 * createTable "Adashis", deps: [Users]
 * createTable "AdashiParticipants", deps: [Adashis, Users]
 * createTable "Addresses", deps: [Users]
 * createTable "Cooperatives", deps: [Users]
 * createTable "CooperativeMembers", deps: [Cooperatives, Users]
 * createTable "LoanTransactions", deps: [Users]
 * createTable "Loans", deps: [Users, Users, Users]
 * createTable "Offsets", deps: [Loans]
 * createTable "Tokens", deps: [Users]
 * createTable "UserConfigs", deps: [Users, Users]
 *
 **/

let info = {
    'revision': 1,
    'name': 'noname',
    'created': '2021-09-12T08:08:35.674Z',
    'comment': ''
};

let migrationCommands = function(transaction) {
    return [{
        fn: 'createTable',
        params: [
            'Emails',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'email': {
                    'type': Sequelize.STRING,
                    'field': 'email',
                    'allowNull': false
                },
                'verified': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'verified'
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
            'Phones',
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
                'number': {
                    'type': Sequelize.STRING,
                    'field': 'number',
                    'allowNull': false
                },
                'verified': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'verified'
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
                'phoneNumber': {
                    'type': Sequelize.STRING,
                    'field': 'phoneNumber'
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
                'gender': {
                    'type': Sequelize.STRING,
                    'field': 'gender'
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
                'bvn': {
                    'type': Sequelize.STRING,
                    'field': 'bvn'
                },
                'nin': {
                    'type': Sequelize.STRING,
                    'field': 'nin'
                },
                'pics': {
                    'type': Sequelize.STRING,
                    'field': 'pics'
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
                'numbers': {
                    'type': Sequelize.ARRAY(Sequelize.STRING),
                    'field': 'numbers'
                },
                'emails': {
                    'type': Sequelize.ARRAY(Sequelize.STRING),
                    'field': 'emails'
                },
                'verifiedNumbers': {
                    'type': Sequelize.ARRAY(Sequelize.STRING),
                    'field': 'verifiedNumbers',
                    'defaultValue': Sequelize.Array
                },
                'verifiedEmails': {
                    'type': Sequelize.ARRAY(Sequelize.STRING),
                    'field': 'verifiedEmails',
                    'defaultValue': Sequelize.Array
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
                'lastLogin': {
                    'type': Sequelize.DATE,
                    'field': 'lastLogin'
                },
                'type': {
                    'type': Sequelize.STRING,
                    'field': 'type',
                    'defaultValue': 'user'
                },
                'password': {
                    'type': Sequelize.STRING,
                    'field': 'password',
                    'allowNULL': false
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
                'creatorId': {
                    'type': Sequelize.UUID,
                    'field': 'creatorId',
                    'onUpdate': 'CASCADE',
                    'onDelete': 'SET NULL',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'allowNull': true
                },
                'currentAddressId': {
                    'type': Sequelize.UUID,
                    'field': 'currentAddressId',
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
                },
                'userId': {
                    'type': Sequelize.UUID,
                    'field': 'userId',
                    'onUpdate': 'CASCADE',
                    'onDelete': 'SET NULL',
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
            'Adashis',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'name': {
                    'type': Sequelize.STRING,
                    'field': 'name'
                },
                'duration': {
                    'type': Sequelize.STRING,
                    'field': 'duration'
                },
                'amount': {
                    'type': Sequelize.INTEGER,
                    'field': 'amount'
                },
                'currency': {
                    'type': Sequelize.STRING,
                    'field': 'currency'
                },
                'numberOfParticipants': {
                    'type': Sequelize.INTEGER,
                    'field': 'numberOfParticipants'
                },
                'status': {
                    'type': Sequelize.STRING,
                    'field': 'status',
                    'defaultValue': 'inactive'
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
                'initiatorId': {
                    'type': Sequelize.UUID,
                    'field': 'initiatorId',
                    'onUpdate': 'CASCADE',
                    'onDelete': 'SET NULL',
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
            'AdashiParticipants',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'dateJoined': {
                    'type': Sequelize.DATE,
                    'field': 'dateJoined'
                },
                'position': {
                    'type': Sequelize.INTEGER,
                    'field': 'position'
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
                'AdashiId': {
                    'type': Sequelize.UUID,
                    'field': 'AdashiId',
                    'onUpdate': 'CASCADE',
                    'onDelete': 'CASCADE',
                    'references': {
                        'model': 'Adashis',
                        'key': 'id'
                    },
                    'unique': 'AdashiParticipants_UserId_AdashiId_unique'
                },
                'UserId': {
                    'type': Sequelize.UUID,
                    'field': 'UserId',
                    'onUpdate': 'CASCADE',
                    'onDelete': 'CASCADE',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'unique': 'AdashiParticipants_UserId_AdashiId_unique'
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
            'Addresses',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'street': {
                    'type': Sequelize.STRING,
                    'field': 'street',
                    'allowNull': false
                },
                'houseName': {
                    'type': Sequelize.STRING,
                    'field': 'houseName',
                    'allowNull': false
                },
                'city': {
                    'type': Sequelize.STRING,
                    'field': 'city',
                    'allowNull': true
                },
                'state': {
                    'type': Sequelize.STRING,
                    'field': 'state'
                },
                'lga': {
                    'type': Sequelize.STRING,
                    'field': 'lga'
                },
                'country': {
                    'type': Sequelize.STRING,
                    'field': 'country'
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
                    'onDelete': 'SET NULL',
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
            'Cooperatives',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'name': {
                    'type': Sequelize.STRING,
                    'field': 'name'
                },
                'constitution': {
                    'type': Sequelize.STRING,
                    'field': 'constitution'
                },
                'mission': {
                    'type': Sequelize.STRING,
                    'field': 'mission'
                },
                'dateIncorporated': {
                    'type': Sequelize.DATE,
                    'field': 'dateIncorporated'
                },
                'dateStarted': {
                    'type': Sequelize.DATE,
                    'field': 'dateStarted'
                },
                'cacNumber': {
                    'type': Sequelize.STRING,
                    'field': 'cacNumber'
                },
                'address': {
                    'type': Sequelize.STRING,
                    'field': 'address'
                },
                'status': {
                    'type': Sequelize.STRING,
                    'field': 'status',
                    'defaultValue': 'inactive'
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
                    'onDelete': 'SET NULL',
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
            'CooperativeMembers',
            {
                'id': {
                    'type': Sequelize.UUID,
                    'field': 'id',
                    'primaryKey': true,
                    'defaultValue': Sequelize.UUIDV1
                },
                'dateJoined': {
                    'type': Sequelize.DATE,
                    'field': 'dateJoined'
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
                'CooperativeId': {
                    'type': Sequelize.UUID,
                    'field': 'CooperativeId',
                    'onUpdate': 'CASCADE',
                    'onDelete': 'CASCADE',
                    'references': {
                        'model': 'Cooperatives',
                        'key': 'id'
                    },
                    'unique': 'CooperativeMembers_UserId_CooperativeId_unique'
                },
                'UserId': {
                    'type': Sequelize.UUID,
                    'field': 'UserId',
                    'onUpdate': 'CASCADE',
                    'onDelete': 'CASCADE',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'unique': 'CooperativeMembers_UserId_CooperativeId_unique'
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
            'LoanTransactions',
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
                    'onDelete': 'NO ACTION',
                    'allowNull': true,
                    'field': 'userId',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'foreignKey': true
                },
                'type': {
                    'type': Sequelize.STRING,
                    'field': 'type',
                    'allowNull': false
                },
                'cleared': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'cleared',
                    'defaultValue': false
                },
                'notify': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'notify'
                },
                'notification': {
                    'type': Sequelize.JSONB,
                    'field': 'notification'
                },
                'dateCleared': {
                    'type': Sequelize.DATE,
                    'field': 'dateCleared'
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
                'dateDeleted': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'dateDeleted',
                    'defaultValue': false
                },
                'dateRequested': {
                    'type': Sequelize.DATE,
                    'field': 'dateRequested'
                },
                'approvalDate': {
                    'type': Sequelize.DATE,
                    'field': 'approvalDate'
                },
                'approvalStatus': {
                    'type': Sequelize.STRING,
                    'field': 'approvalStatus'
                },
                'approvalComments': {
                    'type': Sequelize.STRING,
                    'field': 'approvalComments'
                },
                'confirmed': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'confirmed',
                    'defaultValue': false
                },
                'dateConfirmed': {
                    'type': Sequelize.DATE,
                    'field': 'dateConfirmed'
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
                'lender': {
                    'type': Sequelize.UUID,
                    'onUpdate': 'CASCADE',
                    'onDelete': 'CASCADE',
                    'allowNull': true,
                    'field': 'lender',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'foreignKey': true
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
                'assets': {
                    'type': Sequelize.STRING,
                    'field': 'assets'
                },
                'type': {
                    'type': Sequelize.STRING,
                    'field': 'type',
                    'defaultValue': 'money'
                },
                'amount': {
                    'type': Sequelize.INTEGER,
                    'field': 'amount'
                },
                'quantity': {
                    'type': Sequelize.INTEGER,
                    'field': 'quantity'
                },
                'cleared': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'cleared',
                    'defaultValue': false
                },
                'dateTaken': {
                    'type': Sequelize.DATE,
                    'field': 'dateTaken'
                },
                'lenderNotification': {
                    'type': Sequelize.JSONB,
                    'field': 'lenderNotification'
                },
                'userNotification': {
                    'type': Sequelize.JSONB,
                    'field': 'userNotification'
                },
                'lenderCleared': {
                    'type': Sequelize.JSONB,
                    'field': 'lenderCleared'
                },
                'userCleared': {
                    'type': Sequelize.JSONB,
                    'field': 'userCleared'
                },
                'duration': {
                    'type': Sequelize.JSONB,
                    'field': 'duration'
                },
                'dateToRepay': {
                    'type': Sequelize.DATE,
                    'field': 'dateToRepay'
                },
                'dateCleared': {
                    'type': Sequelize.DATE,
                    'field': 'dateCleared'
                },
                'repaymentOption': {
                    'type': Sequelize.STRING,
                    'field': 'repaymentOption'
                },
                'options': {
                    'type': Sequelize.JSONB,
                    'field': 'options'
                },
                'security': {
                    'type': Sequelize.STRING,
                    'field': 'security'
                },
                'urgency': {
                    'type': Sequelize.STRING,
                    'field': 'urgency'
                },
                'status': {
                    'type': Sequelize.STRING,
                    'field': 'status'
                },
                'dateRequested': {
                    'type': Sequelize.DATE,
                    'field': 'dateRequested'
                },
                'approvalDate': {
                    'type': Sequelize.DATE,
                    'field': 'approvalDate'
                },
                'approvalStatus': {
                    'type': Sequelize.STRING,
                    'field': 'approvalStatus'
                },
                'approvalComments': {
                    'type': Sequelize.STRING,
                    'field': 'approvalComments'
                },
                'confirmed': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'confirmed',
                    'defaultValue': false
                },
                'deleted': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'deleted',
                    'defaultValue': false
                },
                'lenderDeleted': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'lenderDeleted',
                    'defaultValue': false
                },
                'dateConfirmed': {
                    'type': Sequelize.DATE,
                    'field': 'dateConfirmed'
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
                'creatorId': {
                    'type': Sequelize.UUID,
                    'field': 'creatorId',
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
                'isRepaymentOption': {
                    'type': Sequelize.BOOLEAN,
                    'field': 'isRepaymentOption',
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
                'value': {
                    'type': Sequelize.STRING,
                    'field': 'value',
                    'allowNull': true
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
                    'onDelete': 'SET NULL',
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
                    'field': 'userId',
                    'references': {
                        'model': 'Users',
                        'key': 'id'
                    },
                    'foreignKey': true
                },
                'guarantor': {
                    'type': Sequelize.UUID,
                    'field': 'guarantor',
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
        params: ['ActivityLogs', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['AdashiParticipants', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['Adashis', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['Addresses', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['CooperativeMembers', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['Cooperatives', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['Emails', {
            transaction: transaction
        }]
    },
    {
        fn: 'dropTable',
        params: ['LoanTransactions', {
            transaction: transaction
        }]
    },
    {
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
        params: ['Phones', {
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
