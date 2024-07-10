const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedPodcasts: [{ type: mongoose.Schema.Types.ObjectId, ref: "podcasts" }],
});

module.exports = mongoose.model("users", UserSchema);
