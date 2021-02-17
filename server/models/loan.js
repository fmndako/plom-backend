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
    loanItem: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    author: DataTypes.INTEGER,
    other: DataTypes.INTEGER,
    clearStatus: DataTypes.BOOLEAN,
    notify: DataTypes.BOOLEAN,
    offset: DataTypes.BOOLEAN,
    dateTaken: DataTypes.DATE,
    dateToRepay: DataTypes.DATE,
    dateCleared: DataTypes.DATE,
    remarks: DataTypes.STRING,
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
      as: 'UserOffsets',
    });
  };
  return Loan;
};