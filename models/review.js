const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Review = sequelize.define(
  "Review",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    author: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "reviews",
  },
);

module.exports = Review;
