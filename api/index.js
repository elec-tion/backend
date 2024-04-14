const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { errorHandler } = require("./middleware/errorMiddleware");
const PORT = process.env.PORT || 5000;
const IP = process.env.IP || "localhost";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", require("./routes/balanceRoutes"));
app.use("/api", require("./routes/districtRoutes"));
app.use("/api", require("./routes/electionRoutes"));
app.use("/api", require("./routes/committeMembersRoutes"));
app.use("/api", require("./routes/candidateRoutes"));

app.use(errorHandler);

app.listen(PORT, IP, () => console.log(`server started on port http://${IP}:${PORT}`));
