const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rental", require("./routes/RentalRoutes"));

module.exports = app;