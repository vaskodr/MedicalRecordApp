// ExaminationList component (shows a list of all examinations)
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext"; // Import AuthContext
import Examination from "./Examination"; // Ensure this component is implemented correctly

const ExaminationList = () => {
  const { authData } = useContext(AuthContext); // Get authData from context
  const [examinations, setExaminations] = useState([]);
  const navigate = useNavigate();

  const isAdmin =
    authData &&
    authData.authorities &&
    authData.authorities.includes("ROLE_ADMIN");

  useEffect(() => {
    fetch("http://localhost:8084/api/v1/examination/list")
      .then((response) => response.json())
      .then((data) => {
        setExaminations(data);
      })
  }, [authData]);

  // Handle the edit button click
  const handleEdit = (id) =>
    navigate(`/admin/dashboard/examinations/edit/${id}`);

  // Handle the delete button click
  const handleDelete = (id) => {
    if (!authData || !authData.accessToken) {
      alert("You must be logged in to delete an examination.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this examination?")) {
      fetch(`http://localhost:8084/api/v1/examination/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
          "Content-Type": "application/json"
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete the examination");
          }
          // Remove the deleted examination from the state
          setExaminations((prevExaminations) =>
            prevExaminations.filter((e) => e.id !== id)
          );
        })
        .catch((error) => {
          console.error("Error deleting examination:", error);
          alert(
            "Error deleting examination. You may not have permission to perform this action."
          );
        });
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Examinations</h1>
      {isAdmin && (
        <button
          onClick={() => navigate("/admin/dashboard/examinations/create")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Examination
        </button>
      )}
      <div className="mt-4">
        {examinations.length > 0 ? (
          examinations.map((examination) => (
            <Examination
              key={examination.id}
              examination={examination}
              onEdit={handleEdit} // Pass the edit function
              onDelete={handleDelete} // Pass the delete function
              authData={authData} // Pass user role
            />
          ))
        ) : (
          <p className="text-gray-600">No examinations available.</p>
        )}
      </div>
    </div>
  );
};

export default ExaminationList;
