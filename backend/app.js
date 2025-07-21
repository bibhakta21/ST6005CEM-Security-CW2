// app.js
require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const path = require("path");
const connectDb = require("./config/db");


const app = express();

//  Connect to the database
connectDb();

app.get("/", (req, res) => {
  res.send("Welcome");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app; 
