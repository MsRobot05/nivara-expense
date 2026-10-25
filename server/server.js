
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Nivara Expense Management API",
    status: "running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    application: "Nivara",
  });
});
app.get("/api/test-route", (req, res) => {
  res.json({ message: "Test route works" });
});

const { authenticateUser } = require("./authMiddleware");
const { requireRole } = require("./roleMiddleware");
app.get("/api/me", authenticateUser, (req, res) => {
  res.json({
    message: "Authentication successful",
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

app.get("/api/db-check", async (req, res) => {
  const { error } = await supabase
    .from("vouchers")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Database check failed:", error.message);
    return res.status(500).json({
      status: "error",
      message: "Database connection or access check failed.",
    });
  }

  res.json({
    status: "connected",
    message: "Nivara can query the vouchers table.",
  });
});

app.get(
  "/api/vouchers",
  authenticateUser,
  requireRole("employee", "director", "accounts"),
  async (req, res) => {
    try {
      
let query = req.userSupabase
  .from("vouchers")
  .select("*")
  .order("created_at", { ascending: false });
      // Employees may only see their own vouchers.
      if (req.userRole === "employee") {
        query = query.eq("employee_id", req.user.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Voucher list failed:", error.message);
        return res.status(500).json({
          error: "Could not load vouchers.",
        });
      }

      return res.json({ vouchers: data });
    } catch (error) {
      console.error("Voucher list error:", error.message);
      return res.status(500).json({
        error: "An unexpected error occurred.",
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Nivara server running at http://localhost:${PORT}`);
});
