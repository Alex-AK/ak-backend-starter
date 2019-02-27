module.exports = {
  checkRole
};

// check role against decoded token
function checkRole(role) {
  return function(req, res, next) {
    if (req.decodedJwt.roles && req.decodedJwt.roles.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied, improper role.' });
    }
  };
}
