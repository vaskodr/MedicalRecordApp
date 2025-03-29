import React from "react";

const Specialization = ({
  specialization,
  onEdit,
  onDelete,
  editMode,
  setEditMode,
  editedName,
  setEditedName,
  onSaveEdit,
}) => {
  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      {editMode === specialization.id ? (
        <>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="border p-2 mb-2 w-full rounded"
          />
          <div className="flex space-x-2">
            <button
              onClick={() => onSaveEdit(specialization.id)}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(null)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-gray-800">
            {specialization.name}
          </h3>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => {
                setEditMode(specialization.id);
                setEditedName(specialization.name);
              }}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(specialization.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Specialization;
