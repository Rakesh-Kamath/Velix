import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  try {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Extract token from header
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data to request
    req.user = decoded;

    next(); // Pass control to the next middleware or route
  } catch (error) {
    return res.status(401).json({ message: "Token invalid or expired" });
  }
};

export default protect;
