import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret"; // Store this securely

export const signToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" }); // 1-hour token expiration
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};
