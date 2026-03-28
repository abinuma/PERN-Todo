import React, { Fragment, useState } from "react";

const InputTodo = ({ onTodoAdded }) => {
  const [description, setDescription] = useState("");

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      console.warn("⚠️ Input is empty, aborting submit.");
      return;
    }
    
    console.log(`🚀 Trying to add new Todo: "${description}"`);
    console.log("🌐 VITE_API_URL is set to:", import.meta.env.VITE_API_URL);
    const fetchUrl = `${import.meta.env.VITE_API_URL}/todos`;

    try {
      const body = { description };
      console.log(`⏳ Sending POST request to ${fetchUrl} with body:`, body);
      
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("📥 POST response received with status:", response.status);
      if (!response.ok) {
        console.error("⚠️ Response was NOT ok! Status:", response.statusText);
      }

      setDescription("");
      console.log("✅ Successfully added todo. Refreshing list...");
      onTodoAdded();
    } catch (err) {
      console.error("❌ POST request completely failed. Message:", err.message);
      console.error("Full Error details:", err);
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
