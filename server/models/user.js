'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            validate: {isEmail: true}
        },
        firstName: DataTypes.STRING,
        middleName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        dateOfBirth: DataTypes.DATE,
        username: DataTypes.STRING,
        salutation: DataTypes.STRING,
        isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false},
        isSuperadmin: { type: DataTypes.BOOLEAN, defaultValue: false},
        deleted: { type: DataTypes.BOOLEAN, defaultValue: false},
        dateDeleted: DataTypes.DATE,
        gender: DataTypes.STRING,
        address: DataTypes.STRING,
        maritalStatus: DataTypes.STRING,
        acceptedTerms: { type: DataTypes.BOOLEAN, defaultValue: false},
        numbers: DataTypes.ARRAY(DataTypes.STRING),
        emails: DataTypes.ARRAY(DataTypes.STRING),
        verifiedNumbers:{
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        verifiedEmails: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        phoneNumber: DataTypes.STRING,
        businessName: DataTypes.STRING,
        accountType: DataTypes.STRING,
        organization: DataTypes.STRING,
        bussinessAddress: DataTypes.STRING,
        bvn: DataTypes.STRING,
        description: DataTypes.STRING,
        designation: DataTypes.STRING,
        token: DataTypes.STRING,
        tokenCreatedAt: DataTypes.DATE,
        attemptCount: DataTypes.INTEGER,
        timeLocked: DataTypes.DATE,
        accountLocked: DataTypes.BOOLEAN,
        loginMethod: {type: DataTypes.STRING, defaultValue: 'email'},
        status: { 
            type: DataTypes.STRING, 
            defaultValue: 'inactive',
            values : ['inactive', 'active', 'blocked', 'disabled']
        },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
        dateCreated: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
        lastLogin: DataTypes.DATE,
        createdBySelf: {type: DataTypes.BOOLEAN,  defaultValue: true},
        users: {type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: []},
        password: {
            type: DataTypes.STRING,
            allowNULL: false,
            validate:{len: [8, 64]}
        },
    },
    {
        instanceMethods: {
            checkPassword : async function(password){
                return await bcrypt.compare(password, this.password);
            },
        
            getFullname: function() {
                return [this.firstname, this.lastname].join(' ');
            }
        },
        hooks: {
            beforeCreate: async function(user) {
                if (!user.password ) return;
                user.password = await bcrypt.hash(user.password, 8);
            },
        },
   
    });

  
    // User.associate = (models) => {
    //     // User.hasMany(models.Loan, {
    //     //     foreignKey: 'userId',
    //     //     as: 'loans',
    //     // });

    //     User.belongsToMany(User, { as: 'Lender', foreignKey: 'lender', through: models.Loan });
    //     User.belongsToMany(User, { as: 'User', foreignKey: 'userId', through: models.Loan });
    // };
    // User.associate = (models) => {
    //     User.belongsTo(models.Loan, {
    //         foreignKey: 'lender',
    //         as: 'lends',
    //     });
    // };
    User.associate = (models) => {
        User.belongsToMany(User, { as: 'Lender', foreignKey: 'lender', through: models.Loan });
        User.belongsToMany(User, { as: 'User', foreignKey: 'userId', through: models.Loan });

        User.hasMany(models.ActivityLog, { foreignKey: 'userId' });
        User.hasMany(models.Token, {
            foreignKey: 'userId',
            as: 'tokens',
        });

        User.hasMany(models.UserConfig, {
            foreignKey: 'userId',
            as: 'configs',
        });
    };

    User.generateToken = async (user) => {
        user.token = jwt.sign({id: user.id}, process.env.JWT_KEY, {expiresIn: process.env.JWT_EXPIRES_IN} );
        await user.save();
        return user.token;
    };
    User.prototype.checkPassword  = async function(password){
        return await bcrypt.compare(password, this.password);
    };
    User.prototype.setNewPassword  = async function(password){
        this.password = await bcrypt.hash(password, 8);
        this.save();
    };

    return User;
};