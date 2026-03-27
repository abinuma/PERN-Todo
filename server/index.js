require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

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
  try {
    const description = req.body?.description?.trim();
    if (!description) {
      return res.status(400).json({ error: "Description is required." });
    }

    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    return res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: "Failed to create todo." });
  }
});

app.get("/todos", async (_req, res) => {
  try {
    const allTodos = await pool.query(
      "SELECT * FROM todo ORDER BY todo_id DESC"
    );
    return res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to fetch todos." });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

    if (todo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found." });
    }
    return res.json(todo.rows[0]);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to fetch todo." });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
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
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to update todo." });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id]
    );

    if (deletedTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found." });
    }

    return res.json({ message: "Todo was deleted!" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: "Failed to delete todo." });
  }
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});