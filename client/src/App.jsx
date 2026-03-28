import React, { useEffect, useState, Fragment } from "react";
import InputTodo from "./components/InputTodo.jsx";
import ListTodos from "./components/ListTodo.jsx";

export default function App() {
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    const fetchUrl = `${import.meta.env.VITE_API_URL}/todos`;
    console.log("🌐 React Frontend is trying to fetch from:", fetchUrl);
    console.log("Environment variable VITE_API_URL is:", import.meta.env.VITE_API_URL);

    try {
      console.log("⏳ Sending fetch request...");
      const response = await fetch(fetchUrl);
      console.log("📥 Fetch response received with status:", response.status);
      
      if (!response.ok) {
        console.error("⚠️ Response was NOT ok! Status text:", response.statusText);
      }

      const jsonData = await response.json();
      console.log("📦 Parsed JSON data from backend:", jsonData);
      setTodos(jsonData);
    } catch (err) {
      console.error("❌ Fetch strictly failed. Error message:", err.message);
      console.error("Full Error details:", err);
    }
  };

  useEffect(() => {
    console.log("🚀 App Component mounted! Calling getTodos()...");
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
