const jwt = require("jsonwebtoken");

// Generate jwt token
const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" });
  return token;
};

// Check if the token is valid
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(401).json("You are not aunthenticated");
  }
};

// Allow admin and owner of the account to perform some operations
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("You are not allowed to do that");
    }
  });
};

// Allow only admin to perform some operations
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json("You are not an admin");
    }
  });
};

// Export the functions for import in the routes that will need them
module.exports = {
  generateToken,
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
