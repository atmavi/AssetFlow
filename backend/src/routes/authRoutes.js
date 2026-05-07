import { Router } from "express";
import User from "../models/User.js";
import { createMockJwt } from "../utils/mockJwt.js";

const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid credentials."
      });
    }

    const tokenPayload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000)
    };

    const token = createMockJwt(tokenPayload);

    return res.status(200).json({
      token,
      tokenType: "Bearer",
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default authRouter;
