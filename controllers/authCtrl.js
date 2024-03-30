const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "userToken.json"
);
exports.auth = async (req, res, next) => {
  // get token from request
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  // read token file => compare with token received
  const tokenFileJSON = await fs.promises.readFile(p, { encoding: "utf-8" });
  const tokenFile = JSON.parse(tokenFileJSON);

  const isTokenValid = tokenFile.some((t) => t.token === token);
  if (isTokenValid) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
