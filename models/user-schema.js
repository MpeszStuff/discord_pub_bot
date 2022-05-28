const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: { type: String, required: true },
  paladinsId: { type: String, default: null },
  userName: { type: String, default: "default" },
  teamId: { type: String, default: null },
  currency: { type: Number, default: 100 },
  joinCounter: { type: Number, default: 1 },
  notes: { type: Array },
  dateOfFirstJoin: { type: Date },
});

const name = "user-table";
module.exports =
  mongoose.models[name] || mongoose.model(name, userSchema, name);
