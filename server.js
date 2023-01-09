const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
require("dotenv/config");

mongoose.connect(
  "mongodb+srv://catherine:Password123@cluster0.ubsr8e0.mongodb.net/?retryWrites=true&w=majority"
);

const loginRoute = require("./routes/login");
const singupRoute = require("./routes/signup");
const searchRoute = require("./routes/searchpage");

app.use(cors());


// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", true);
//   next();
// });

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//         "Access-Control-Allow-Headers",
//         "Content-Type"
//       );

//     if (req.method === "OPTIONS") {
//       res.header("Access-Control-Allow-Methods", "POST, GET, PATCH");
//     }

//   next();
// });
app.use(express.json());

app.use("/login", loginRoute);
app.use("/signup", singupRoute);
app.use("/search", searchRoute);

app.listen(port);
