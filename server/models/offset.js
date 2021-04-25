'use strict';

module.exports = (sequelize, DataTypes) => {
    const Offset = sequelize.define('Offset', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        loanId: {
            type: DataTypes.UUID,
            foreignKey: true,
            references: {
                model: 'Loans',
                key: 'id'
            }
        },
        amount: DataTypes.INTEGER,
        date: DataTypes.DATE,
        remarks: DataTypes.STRING,
    });

    Offset.associate = (models) => {
        Offset.belongsTo(models.Loan, {
            foreignKey: 'loanId',
            onDelete: 'CASCADE',
        });
    };
    return Offset;
};