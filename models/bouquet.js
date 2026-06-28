const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Bouquet = sequelize.define(
  "Bouquet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    photoURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "bouquets",
  },
);

module.exports = Bouquet;
