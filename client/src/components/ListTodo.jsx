import React, { Fragment } from "react";
import EditTodo from "./EditTodo.jsx";

const ListTodos = ({ todos, refreshTodos }) => {
  const deleteTodo = async (id) => {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:5000"}/todos/${id}`,
        {
          method: "DELETE",
        }
      );

      refreshTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <table className="table mt-5 mb-5 text-center todo-table">
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
                <EditTodo todo={todo} onUpdated={refreshTodos} />
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
