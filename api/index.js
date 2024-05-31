const express = require("express");
const dotenv = require("dotenv"); dotenv.config();
const expressPinoLogger = require('express-pino-logger');
const cors = require('cors');

const { apiKeyAuth } = require('./middleware/authMiddleware');
const { errorHandler } = require("./middleware/errorMiddleware");
const logger = require("./utils");

const PORT = process.env.PORT || 5000;
const IP = process.env.IP || "localhost";

const app = express();

// This two route is for welcoming and testing the API
app.get("/", (req, res) => {
    res.status(200).json({"message": "Welcome to the API"});
});
app.get("/api", (req, res) => {
    res.status(200).json({"message": "API is running"});
});

app.use(cors()); // Add cors middleware to allow local requests
app.use(apiKeyAuth);
app.use(errorHandler);
app.use(express.json());
app.use(expressPinoLogger({ logger }));
app.use(express.urlencoded({ extended: false }));

app.use("/api", require("./routes/balanceRoutes"));
app.use("/api", require("./routes/districtRoutes"));
app.use("/api", require("./routes/electionRoutes"));
app.use("/api", require("./routes/committeMembersRoutes"));
app.use("/api", require("./routes/candidateRoutes"));
app.use("/api", require("./routes/voterRoutes"));
app.use("/api", require("./routes/contractRoutes"));

app.listen(PORT, IP, () => logger.info(`server started on port http://${IP}:${PORT}`));

