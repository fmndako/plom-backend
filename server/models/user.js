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
            validate: { isEmail: true },
        },
        phoneNumber: {
            type: DataTypes.STRING,
        },
        firstName: DataTypes.STRING,
        middleName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        dateOfBirth: DataTypes.DATE,
        username: DataTypes.STRING,
        salutation: DataTypes.STRING,
        isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false},
        isSuperadmin: { type: DataTypes.BOOLEAN, defaultValue: false},
        gender: DataTypes.STRING,
        maritalStatus: DataTypes.STRING,
        acceptedTerms: { type: DataTypes.BOOLEAN, defaultValue: false},
        bvn: DataTypes.STRING,
        nin: DataTypes.STRING,
        pics: DataTypes.STRING,
        token: DataTypes.STRING,
        tokenCreatedAt: DataTypes.DATE,
        attemptCount: DataTypes.INTEGER,
        timeLocked: DataTypes.DATE,
        accountLocked: DataTypes.BOOLEAN,
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
        status: { 
            type: DataTypes.STRING, 
            defaultValue: 'inactive',
            values : ['inactive', 'active', 'blocked', 'disabled']
        },
        isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
        lastLogin: DataTypes.DATE,
        type: { type: DataTypes.STRING, defaultValue: 'user' },
        password: {
            type: DataTypes.STRING,
            allowNULL: false,
            validate:{len: [8, 64]}
        },
        deleted: { type: DataTypes.BOOLEAN, defaultValue: false},
        dateDeleted: DataTypes.DATE,
    },
    {
        hooks: {
            beforeCreate: async function(user) {
                if (!user.password ) return;
                user.password = await bcrypt.hash(user.password, 8);
            },
        },
   
    });

    User.associate = (models) => {
        User.hasOne(User, {as: 'creator'});
        //contacts
        // User.hasMany(models.Email, { foreignKey: 'userId' });

        // User.hasMany(models.Phone, { foreignKey: 'userId' });
        // User.belongsTo(models.Phone, { as: 'phoneNumber', constraints: false }); 
        
        User.hasMany(models.Address, { foreignKey: 'userId' });
        User.belongsTo(models.Address, { as: 'currentAddress', constraints: false }); 

        // cooperative
        User.belongsToMany(models.Cooperative, { as: 'cooperative', through: 'CooperativeMember'});

        // adashi
        User.hasOne(models.Adashi, {as: 'initiator'});
        User.belongsToMany(models.Adashi, { as: 'adashi', through: 'AdashiParticipant' });

        User.hasMany(models.ActivityLog, { foreignKey: 'userId' });
        User.hasMany(models.Token, {
            foreignKey: 'userId',
            as: 'tokens',
        });

    };

    User.generateToken = async (user) => {
        user.token = jwt.sign({id: user.id}, process.env.JWT_KEY, {expiresIn: process.env.JWT_EXPIRES_IN} );
        await user.save();
        return user.token;
    };
    User.prototype.checkPassword  = async (password) => {
        return await bcrypt.compare(password, this.password);
    };
    User.prototype.setNewPassword  = async (password) => {
        this.password = await bcrypt.hash(password, 8);
        this.save();
    };

    return User;
};