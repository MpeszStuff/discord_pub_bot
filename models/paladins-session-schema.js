const mongoose = require("mongoose");
const { Schema } = mongoose;

const paladinsSessionSchema = new Schema(
  {
    ret_msg: { type: String },
    session_id: { type: String },
  },
  { timestamps: true }
);

const name = "paladins-session-table";
module.exports =
  mongoose.models[name] || mongoose.model(name, paladinsSessionSchema, name);
