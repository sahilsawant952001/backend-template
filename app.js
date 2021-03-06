const express = require("express");
const app = express();
const cors = require('cors');

const authRoutes = require('./API/Routes/Auth');
const userRoutes = require('./API/Routes/User');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use('/auth',authRoutes);
app.use('/user',userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;