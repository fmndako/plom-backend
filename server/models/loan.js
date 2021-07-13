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
        cleared: {type: DataTypes.BOOLEAN,  defaultValue: false,},
        // clearConfirmed:  {type: DataTypes.BOOLEAN,  defaultValue: false,},
        notify: DataTypes.BOOLEAN,
        dateTaken: DataTypes.DATE,
        dateToRepay: DataTypes.DATE,
        dateCleared: DataTypes.DATE,
        repaymentOptions: DataTypes.STRING,
        remarks: DataTypes.STRING,
        deleted: {type: DataTypes.BOOLEAN,  defaultValue: false,},
        lenderDeleted: {type: DataTypes.BOOLEAN,  defaultValue: false,},
        // loanConfirmed: {type: DataTypes.BOOLEAN,  defaultValue: false,},
    });

    Loan.associate = (models) => {
        Loan.belongsTo(models.User, { as: 'User', foreignKey: 'userId', onDelete: 'CASCADE'});
        Loan.belongsTo(models.User, { as: 'Lender', foreignKey: 'lender', onDelete: 'CASCADE' });
        Loan.hasMany(models.Offset, {
            foreignKey: 'loanId',
            as: 'offsets',
        });
    };
    return Loan;
};