import React, { Fragment, useState } from "react";

const EditTodo = ({ todo, onUpdated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState(todo.description);

  const closeModal = () => {
    setDescription(todo.description);
    setIsOpen(false);
  };

  const updateDescription = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    try {
      const body = { description };
      await fetch(
        `${import.meta.env.VITE_API_URL}/todos/${todo.todo_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      setIsOpen(false);
      onUpdated?.();
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <Fragment>
      <button
        type="button"
        className="btn btn-warning"
        onClick={() => setIsOpen(true)}
      >
        Edit
      </button>

      {isOpen && (
        <>
          <div className="modal d-block" tabIndex="-1" onClick={closeModal}>
            <div
              className="modal-dialog modal-lg"
              role="document"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Todo</h5>
                  <button
                    type="button"
                    className="close"
                    aria-label="Close"
                    onClick={closeModal}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <form onSubmit={updateDescription}>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-warning">
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </Fragment>
  );
};

export default EditTodo;
