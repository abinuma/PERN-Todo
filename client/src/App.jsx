import React, { useEffect, useState, Fragment } from "react";
import InputTodo from "./components/InputTodo.jsx";
import ListTodos from "./components/ListTodo.jsx";

export default function App() {
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    const fetchUrl = `${import.meta.env.VITE_API_URL}/todos`;
    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        console.error("⚠️ Fetch failed: " + response.statusText);
      }
      const jsonData = await response.json();
      setTodos(jsonData);
    } catch (err) {
      console.error("Fetch strictly failed:", err);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <Fragment>
      <div className="container app-container mt-5">
        <InputTodo onTodoAdded={getTodos} />
        <ListTodos todos={todos} refreshTodos={getTodos} />
      </div>
    </Fragment>
  );
}
