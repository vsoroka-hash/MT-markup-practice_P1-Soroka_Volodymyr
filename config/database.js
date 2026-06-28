const { Sequelize } = require("sequelize");

const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: "postgres",
      protocol: "postgres",
      logging: false,
      dialectOptions: {
        ssl:
          process.env.DB_SSL === "false"
            ? false
            : {
                require: true,
                rejectUnauthorized: false,
              },
      },
    })
  : new Sequelize(
      process.env.DB_NAME || "",
      process.env.DB_USER || "",
      process.env.DB_PASSWORD || "",
      {
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 5432,
        dialect: "postgres",
        logging: false,
      },
    );

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.info("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = {
  sequelize,
  connectDatabase,
};
