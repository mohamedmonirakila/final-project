import jwt from "jsonwebtoken";

const JWT_SECRET = "glowdentalclinic"; // Same key used for signing

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export const authorizeRoles = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role; // Role decoded from JWT
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: "Access denied." });
  }
  next();
};

// router.get(
//   "/admin-route",
//   authenticateToken,
//   authorizeRoles(["admin"]),
//   (req, res) => {
//     res.json({ message: "Welcome, Admin!" });
//   }
// );
