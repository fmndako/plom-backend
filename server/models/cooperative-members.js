'use strict';
module.exports = (sequelize, DataTypes) => {
    const CooperativeMember = sequelize.define('CooperativeMember', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        dateJoined: DataTypes.DATE,
    });
    return CooperativeMember;
};