const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { errorHandler } = require("./middleware/errorMiddleware");
const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", require("./routes/balanceRoutes"));
app.use("/api", require("./routes/districtRoutes"));
app.use("/api", require("./routes/electionRoutes"));
app.use("/api", require("./routes/committeMembersRoutes"));

app.use(errorHandler);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));
