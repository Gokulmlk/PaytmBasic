const express = require("express");
const PORT = 3000;
const cors = require("cors");



app.use(cors());
app.use(express.json());


const mainRouter = require("./routes/index");
const app = express();


app.use("api/v1" , mainRouter)
app.listen(PORT);


