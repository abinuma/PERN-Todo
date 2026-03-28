import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);
app.use(express.json());

// ========== AUTOMATIC TABLE CREATION ==========
const initDB = async () => {
  try {
    const nowResult = await pool.query('SELECT NOW()');
    console.log(`✅ Database connected – server time: ${nowResult.rows[0].now}`);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todo (
        todo_id SERIAL PRIMARY KEY,
        description VARCHAR(255)
      );
    `);
    console.log('✅ Table "todo" is ready');
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  }
};
// ==============================================

// Health check
app.get("/health", async (_req, res) => {
  res.json({ ok: true });
});

// Routes
app.post("/todos", async (req, res, next) => {
  const description = req.body?.description?.trim();
  if (!description) {
    return res.status(400).json({ error: "Description is required." });
  }

  try {
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    return res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error("❌ DB Insert Failed in POST /todos:", err);
    next(err);
  }
});

app.get("/todos", async (_req, res, next) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id DESC");
    return res.json(allTodos.rows);
  } catch (err) {
    console.error("❌ DB Query Failed in GET /todos:", err);
    next(err);
  }
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

// Start the server only after the database is ready
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
  });
});








// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import pool from "./db.js";

// const app = express();
// const PORT = Number(process.env.PORT || 5000);
// const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

// app.use(
//   cors({
//     origin: [CLIENT_ORIGIN, "http://localhost:3000"],
//   })
// );
// app.use(express.json());

// // Request logger
// app.use((req, res, next) => {
//   console.log(`\n[${new Date().toISOString()}] ${req.method} request to ${req.url}`);
//   console.log(`Headers Origin:`, req.headers.origin);
//   next();
// });

// app.get("/health", async (_req, res) => {
//   res.json({ ok: true });
// });

// app.post("/todos", async (req, res, next) => {
//   console.log("➡️ POST /todos received body:", req.body);
//   const description = req.body?.description?.trim();
//   if (!description) {
//     console.warn("⚠️ Description is missing in request!");
//     return res.status(400).json({ error: "Description is required." });
//   }

//   try {
//     const newTodo = await pool.query(
//       "INSERT INTO todo (description) VALUES($1) RETURNING *",
//       [description]
//     );
//     console.log("✅ Successfully inserted into DB:", newTodo.rows[0]);
//     return res.status(201).json(newTodo.rows[0]);
//   } catch (err) {
//     console.error("❌ DB Insert Failed in POST /todos:", err);
//     next(err);
//   }
// });

// app.get("/todos", async (_req, res, next) => {
//   console.log("➡️ Attempting to query DB for all todos...");
//   try {
//     const allTodos = await pool.query("SELECT * FROM todo ORDER BY todo_id DESC");
//     console.log(`✅ Successfully fetched ${allTodos.rows.length} todos from DB.`);
//     return res.json(allTodos.rows);
//   } catch (err) {
//     console.error("❌ DB Query Failed in GET /todos:", err);
//     next(err);
//   }
// });

// app.get("/todos/:id", async (req, res) => {
//   const { id } = req.params;
//   const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);

//   if (todo.rows.length === 0) {
//     return res.status(404).json({ error: "Todo not found." });
//   }
//   return res.json(todo.rows[0]);
// });

// app.put("/todos/:id", async (req, res) => {
//   const { id } = req.params;
//   const description = req.body?.description?.trim();

//   if (!description) {
//     return res.status(400).json({ error: "Description is required." });
//   }

//   const updatedTodo = await pool.query(
//     "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
//     [description, id]
//   );

//   if (updatedTodo.rows.length === 0) {
//     return res.status(404).json({ error: "Todo not found." });
//   }

//   return res.json(updatedTodo.rows[0]);
// });

// app.delete("/todos/:id", async (req, res) => {
//   const { id } = req.params;
//   const deletedTodo = await pool.query(
//     "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
//     [id]
//   );

//   if (deletedTodo.rows.length === 0) {
//     return res.status(404).json({ error: "Todo not found." });
//   }

//   return res.json({ message: "Todo was deleted!" });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: err.message || "Failed to process request." });
// });

// app.listen(PORT, () => {
//   console.log(`Server has started on port ${PORT}`);
// });