import React, { Fragment, useEffect, useState } from "react";

import EditTodo from "./EditTodo.jsx";

const ListTodos = () => {
  const [todos, setTodos] = useState([]);

  const deleteTodo = async (id) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      setTodos((prev) => prev.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  const getTodos = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/todos`
      );
      const jsonData = await response.json();

      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <Fragment>
      <table className="table mt-5   mb-5 text-center todo-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.todo_id}>
              <td>{todo.description}</td>
              <td>
                <EditTodo todo={todo} onUpdated={getTodos} />
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo.todo_id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default ListTodos;

