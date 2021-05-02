'use strict';

module.exports = (sequelize, DataTypes) => {
    const Loan = sequelize.define('Loan', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lender: {
            type: DataTypes.UUID,
            foreignKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.UUID,
            foreignKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        loanItem: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        cleared: DataTypes.BOOLEAN,
        notify: DataTypes.BOOLEAN,
        dateTaken: DataTypes.DATE,
        dateToRepay: DataTypes.DATE,
        dateCleared: DataTypes.DATE,
        repaymentOptions: DataTypes.STRING,
        remarks: DataTypes.STRING,
        deleted: {type: DataTypes.BOOLEAN,  defaultValue: false,},
    });

    Loan.associate = (models) => {
        Loan.belongsTo(models.User, {
            foreignKey: 'userId',
            onDelete: 'CASCADE',
        });
    };
    Loan.associate = (models) => {
        Loan.hasMany(models.Offset, {
            foreignKey: 'loanId',
            as: 'offsets',
        });
    };
    return Loan;
};