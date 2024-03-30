const express = require("express");
const dotenv = require("dotenv").config();
const {errorHandler} = require('./middleware/errorMiddleware')
const PORT = process.env.PORT;

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api', require('./routes/balanceRoutes'))

app.use(errorHandler)

app.listen(PORT, () => console.log(`server started on port ${PORT}`));