require("dotenv").config({ quiet: true });

const fs = require("fs/promises");
const app = require("./app");
const { sequelize, connectDatabase } = require("./config/database");
const { seedBouquets } = require("./services/bouquetService");

const PORT = process.env.PORT || 3000;

async function readInitialBouquets() {
  try {
    const raw = await fs.readFile("db.json", "utf8");
    const data = JSON.parse(raw);
    return data.bouquets || [];
  } catch (error) {
    return [];
  }
}

async function startServer() {
  await fs.mkdir("temp", { recursive: true });
  await fs.mkdir("public/photos", { recursive: true });
  await connectDatabase();
  await sequelize.sync();
  await seedBouquets(await readInitialBouquets());

  app.listen(PORT, () => {
    console.info(`Server is running on port ${PORT}`);
  });
}

startServer();
