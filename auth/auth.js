// env access
require('dotenv').config();

// package imports
const jwt = require('jsonwebtoken');

module.exports = {
  auth
};

// from env
const secret = process.env.SECRET;

// verify token for user
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        // record the event in logging system, to log when tampered tokens have been sent
        res.status(401).json({ message: 'You are not verified' });
      } else {
        // no need to send this back unless you need to extract information from it
        // this example, it's passing back role of student
        req.decodedJwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'You are not verified' });
  }
}
