const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const User = require("../models/User");

module.exports = {
  async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      const userId = decodedToken.data;
      if (!(await User.findOne({ _id: ObjectId(userId) }))) {
        throw "Invalid token";
      } else {
        req.body.userId = userId;
        next();
      }
    } catch (err) {
      console.log("err:", err);
      res.status(401).json({
        error: new Error("Invalid request!"),
      });
    }
  },
  generateAccessToken(userId) {
    return jwt.sign({ data: userId }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
  },
};
