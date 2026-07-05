const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bouquetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bouquetTitle: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    customerName: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(40),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(240),
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "orders",
  },
);

module.exports = Order;
