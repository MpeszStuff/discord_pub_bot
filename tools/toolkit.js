const paladinsSessionSchema = require("../models/paladins-session-schema");

// Create Session
const createCurrentSession = async (data) => {
  let createdSession = await paladinsSessionSchema.create({
    ret_msg: data.ret_msg,
    session_id: data.session_id,
  });
  console.log("New current session saved.");
};

// Delete Session
const editCurrentSession = async () => {
  const filter = {};
  const update = {
    ret_msg: "Expired",
  };
  let editedCurrentSession = await paladinsSessionSchema.findOneAndUpdate(
    filter,
    update,
    { sort: { createdAt: -1 } }
  );

  console.log("Old session has beed edited.");
};

// Get Current Session
const getCurrentSession = async () => {
  let currentSession = await paladinsSessionSchema.findOne(
    {},
    {},
    { sort: { createdAt: -1 } }
  );

  if (!currentSession) return null;
  if (currentSession.ret_msg !== "Approved") return null;
  return currentSession.session_id;
};

module.exports = {
  getCurrentSession,
  editCurrentSession,
  createCurrentSession,
};
