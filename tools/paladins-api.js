const {
  getCurrentSession,
  createCurrentSession,
  editCurrentSession,
} = require("./toolkit");
const paladinsSessionSchema = require("../models/paladins-session-schema");

const mycrypto = require("crypto");
const moment = require("moment");
const https = require("https");

const devId = process.env.DEVID || "3545";
const apiKey = process.env.APIKEY || "B1B0831987444E548ED710B76C9254F9";
const endPoint =
  process.env.ENDPOINT || "https://api.paladins.com/paladinsapi.svc/";

// Tools
const createSignature = (method = "createsession") => {
  return mycrypto
    .createHash("md5")
    .update(devId + method + apiKey + getDate())
    .digest("hex");
};

const makeGetRequest = (url) => {
  return new Promise(function (resolve, reject) {
    https.get(url, (resp) => {
      let data = "";
      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        resolve(data);
      });

      resp.on("error", (err) => {
        reject(err);
      });
    });
  });
};

const getDate = () => {
  function pad2(n) {
    return n < 10 ? "0" + n : n;
  }

  var date = new Date();

  return (
    date.getUTCFullYear().toString() +
    pad2(date.getUTCMonth() + 1) +
    pad2(date.getUTCDate()) +
    pad2(date.getUTCHours()) +
    pad2(date.getUTCMinutes()) +
    pad2(date.getUTCSeconds())
  );
};

// Create Session
const createSession = async () => {
  const result = await makeGetRequest(
    endPoint +
      "createsessionJson" +
      "/" +
      devId +
      "/" +
      createSignature() +
      "/" +
      getDate()
  );

  const mydata = {
    ret_msg: JSON.parse(result).ret_msg,
    session_id: JSON.parse(result).session_id,
  };

  createCurrentSession(mydata);

  setTimeout(() => {
    editCurrentSession();
  }, 900000); // 15 min

  return JSON.parse(result).session_id;
};

// GetPlayerIdByName
const getPlayerIdByName = async (player) => {
  if (!player) return 0;
  const sessionId = await validateSession();
  const result = await makeGetRequest(
    endPoint +
      "getplayeridbynameJson" +
      "/" +
      devId +
      "/" +
      createSignature("getplayeridbyname") +
      "/" +
      sessionId +
      "/" +
      getDate() +
      "/" +
      player
  );
  return JSON.parse(result).length !== 0 ? JSON.parse(result)[0].player_id : 0;
};

// getPlayerIdsByGamertag
const getPlayerIdsByGamertag = async (username, platform) => {
  if (!username || !platform) return 0;
  const sessionId = await validateSession();
  const result = await makeGetRequest(
    endPoint +
      "getplayeridsbygamertagJson" +
      "/" +
      devId +
      "/" +
      createSignature("getplayeridsbygamertag") +
      "/" +
      sessionId +
      "/" +
      getDate() +
      "/" +
      platform +
      "/" +
      username
  );
  return JSON.parse(result).length !== 0 ? JSON.parse(result)[0].player_id : 0;
};

// getPlayer
const getPlayer = async (playerid) => {
  if (!playerid) return 0;
  // get session from json

  const sessionId = await validateSession();

  const result = await makeGetRequest(
    endPoint +
      "getPlayerJson" +
      "/" +
      devId +
      "/" +
      createSignature("getplayer") +
      "/" +
      sessionId +
      "/" +
      getDate() +
      "/" +
      playerid
  );
  return JSON.parse(result).length !== 0 ? JSON.parse(result)[0] : 0;
};

// testSession
const isSessionValid = async (session) => {
  if (session.length === 0) return false;
  const result = await makeGetRequest(
    endPoint +
      "testSessionJson" +
      "/" +
      devId +
      "/" +
      createSignature("testsession") +
      "/" +
      session +
      "/" +
      getDate()
  );

  if (result.includes("Invalid")) {
    const filter = {
      session_id: session,
    };
    const update = {
      ret_msg: "Expired",
    };
    let s = await paladinsSessionSchema.findOneAndUpdate(filter, update);

    return false;
  }
  return true;
};

const validateSession = async () => {
  let sessionId = await getCurrentSession();

  // check if session exist
  if (!sessionId) {
    // if it's not, create one
    sessionId = await createSession();
  } else {
    // if it is, check if valid
    if (!(await isSessionValid(sessionId))) {
      //if it's not, create another
      sessionId = await createSession();
    }
  }
  return sessionId;
};

module.exports = { getPlayerIdByName, getPlayerIdsByGamertag, getPlayer };
