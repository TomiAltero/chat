const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey"; 

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]; 

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; 
      next(); 
    } catch (error) {
      return res.status(403).json({ message: "Token no válido" });
    }
  } else {
    return res.status(401).json({ message: "No se proporcionó un token" });
  }
};

module.exports = authenticateToken;
