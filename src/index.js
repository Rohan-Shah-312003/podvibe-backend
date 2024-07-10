const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRouter = require("./routes/users");
const podcastsRouter = require("./routes/podcasts");

const app = express();

// middlewares

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/podcasts", podcastsRouter);

mongoose.connect(
  "mongodb+srv://rohan312003:293195@cluster0.sd4llbd.mongodb.net/podcaststream?retryWrites=true&w=majority&appName=Cluster0"
);
const db = mongoose.connection;
db.on("open", () => {
  console.log("DB Connected");
});

db.on("error", () => {
  console.log("DB not conneted");
});

app.listen(5500, () => {
  console.log("server started at port 5500");
});
