import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: [CLIENT_ORIGIN, "http://localhost:3000"],
  })
);
app.use(express.json());

app.get("/health", async (_req, res) => {
  res.json({ ok: true });
});

app.post("/todos", async (req, res) => {
  const description = req.body?.description?.trim();
  if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  const newTodo = await pool.query(
    "INSERT INTO todo (description) VALUES($1) RETURNING *",
    [description]
  );
  return res.status(201).json(newTodo.rows[0]);
});

app.get("/todos", async (_req, res) => {
  const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id DESC");
  return res.json(allTodos.rows);
});

app.get("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

  if (todo.rows.length === 0) {
    return res.status(404).json({ error: "Todo not found." });
  }
  return res.json(todo.rows[0]);
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const description = req.body?.description?.trim();

  if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  const updatedTodo = await pool.query(
    "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
    [description, id]
  );

  if (updatedTodo.rows.length === 0) {
    return res.status(404).json({ error: "Todo not found." });
  }

  return res.json(updatedTodo.rows[0]);
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await pool.query(
    "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
    [id]
  );

  if (deletedTodo.rows.length === 0) {
    return res.status(404).json({ error: "Todo not found." });
  }

  return res.json({ message: "Todo was deleted!" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Failed to process request." });
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});