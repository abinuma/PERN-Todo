import React, { Fragment, useState } from "react";

const InputTodo = ({ onTodoAdded }) => {
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      const body = { description };
      await fetch(
        `${import.meta.env.VITE_API_URL}/todos`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      setDescription("");
      onTodoAdded();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <h1 className="text-center mt-5">Pern Todo List</h1>
      <form className="d-flex mt-5" onSubmit={onSubmitForm}>
        <input
          type="text"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder=""
        />
        <button className="btn btn-success ml-2">
          Add
        </button>
      </form>
    </Fragment>
  );
};

export default InputTodo;
