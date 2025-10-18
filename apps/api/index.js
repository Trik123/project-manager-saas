import express from "express";
import bcrypt from "bcryptjs"; // using bcryptjs
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS config for frontend on localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // allow sending cookies
  })
);

const JWT_SECRET = "supersecret"; // use env var in prod

// --- REGISTER ---
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, name, passwordHash: hash },
    });
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    res.status(400).json({ error: "User already exists" });
  }
});

// --- LOGIN ---
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });

  // set cookie
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true if HTTPS
  });

  res.json({ message: "Logged in" });
});

// --- GET CURRENT USER ---
app.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (e) {
    res.status(401).json({ error: "Invalid token" });
  }
});

// --- LOGOUT ---
app.post("/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.listen(3001, () => console.log("API running on http://localhost:3001"));
