import React, { useState, useEffect } from "react";
import Specialization from "./Specialization";

const SpecializationList = () => {
  const [specializations, setSpecializations] = useState([]);
  const [newSpecializationName, setNewSpecializationName] = useState("");
  const [editMode, setEditMode] = useState(null); // Track which specialization is being edited
  const [editedName, setEditedName] = useState(""); // Edited specialization name


  const fetchSpecializations = () => {
    fetch("http://localhost:8084/api/v1/specialization/list")
      .then((response) => response.json())
      .then((data) => setSpecializations(data))
      .catch((error) =>
        console.error("Error fetching specializations: ", error)
      );
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const handleAddSpecialization = () => {
    if (newSpecializationName.trim()) {
      fetch("http://localhost:8084/api/v1/specialization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSpecializationName }),
      })
        .then(() => {
          setNewSpecializationName("");
          fetchSpecializations();
        })
        .catch((error) =>
          console.error("Error adding specialization: ", error)
        );
    }
  };

  const handleEditSpecialization = (id) => {
    if (editedName.trim()) {
      fetch(`http://localhost:8084/api/v1/specialization/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editedName }),
      })
        .then(() => {
          setEditMode(null);
          setEditedName("");
          fetchSpecializations(); // Refetch the data
        })
        .catch((error) =>
          console.error("Error editing specialization: ", error)
        );
    }
  };

  const handleDeleteSpecialization = (id) => {
    fetch(`http://localhost:8084/api/v1/specialization/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setSpecializations((prev) => prev.filter((s) => s.id !== id));
        fetchSpecializations();
      })
      .catch((error) =>
        console.error("Error deleting specialization: ", error)
      );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Specialization List
      </h2>

      {/* Add New Specialization */}
      <div className="flex mb-6">
        <input
          type="text"
          value={newSpecializationName}
          onChange={(e) => setNewSpecializationName(e.target.value)}
          placeholder="Add new specialization"
          className="border p-2 flex-grow rounded-l"
        />
        <button
          onClick={handleAddSpecialization}
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Add
        </button>
      </div>

      {/* List Specializations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specializations.length > 0 ? (
          specializations.map((specialization) => (
            <Specialization
              key={specialization.id}
              specialization={specialization}
              onEdit={handleEditSpecialization}
              onDelete={handleDeleteSpecialization}
              editMode={editMode}
              setEditMode={setEditMode}
              editedName={editedName}
              setEditedName={setEditedName}
              onSaveEdit={handleEditSpecialization}
            />
          ))
        ) : (
          <p className="text-gray-700">No specializations available</p>
        )}
      </div>
    </div>
  );
};

export default SpecializationList;
