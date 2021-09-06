'use strict';

module.exports = (sequelize, DataTypes) => {
    const Cooperative = sequelize.define('Cooperative', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        name: DataTypes.STRING,
        constitution: DataTypes.STRING,
        mission: DataTypes.STRING,
        dateIncorporated: DataTypes.DATE,
        dateStarted: DataTypes.DATE,
        cacNumber: DataTypes.STRING,
        // admins: [{ type: DataTypes.BOOLEAN, defaultValue: false}],
        // complianceOfficers: [{ type: DataTypes.BOOLEAN, defaultValue: false}],
        address: DataTypes.STRING,
        status: { 
            type: DataTypes.STRING, 
            defaultValue: 'inactive',
            values : ['inactive', 'active', 'blocked', 'disabled']
        },
        // createdBy: {type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: []},
    });

    Cooperative.associate = (models) => {
        Cooperative.belongsTo(models.User, { as: 'user', foreignKey: 'userId'}); 
        Cooperative.belongsToMany(models.User, { as: 'member', through: 'CooperativeMember'});
    };
    return Cooperative;
};