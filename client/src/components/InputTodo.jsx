import React, { Fragment, useState } from "react";

const InputTodo = ({ onTodoAdded }) => {
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      console.warn("⚠️ Input is empty, aborting submit.");
      return;
    }
    
    const fetchUrl = `${import.meta.env.VITE_API_URL}/todos`;

    try {
      const body = { description };
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("Failed to add todo!");
      }

      setDescription("");
      onTodoAdded();
    } catch (err) {
      console.error("POST request failed:", err);
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
