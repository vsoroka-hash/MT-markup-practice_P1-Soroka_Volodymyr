const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const bouquetRoutes = require("./routes/bouquetRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/images", express.static(path.join(process.cwd(), "images")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api/bouquets", bouquetRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
