const express = require("express");
const path = require("path");
const bookRoutes = require("./routes/book");
const userRoutes = require("./routes/user");
const helmet = require("helmet");

require("dotenv").config();

const mongoose = require("mongoose");
const Book = require("./models/book");

mongoose
  .connect(
    `mongodb+srv://${process.env.LOGIN}:${process.env.PASSWORD}@${process.env.CLUSTER}/${process.env.DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

/*console.log(mongodbURI);*/

const app = express();
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
