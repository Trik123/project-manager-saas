import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = "supersecret"; // for dev only, later use env variable

// Register
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, name, passwordHash: hash },
    });
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    res.status(400).json({ error: "User already exists" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true });
  res.json({ message: "Logged in" });
});

// Get current user
app.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    res.json(user);
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// Logout
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
