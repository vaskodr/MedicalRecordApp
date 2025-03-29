const Doctor = ({ doctor, specializationNames, onEdit, onView, onDelete }) => {
  if (!doctor) {
    return <div className="text-red-500">Error: Doctor data is missing</div>;
  }

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <h3 className="text-xl font-semibold text-gray-800">
        {doctor.firstName} {doctor.lastName}
      </h3>
      <p className="text-gray-700">
        <strong>Username:</strong> {doctor.username}
      </p>
      <p className="text-gray-700">
        <strong>Email:</strong> {doctor.email}
      </p>
      <p className="text-gray-700">
        <strong>Phone:</strong> {doctor.phone}
      </p>
      <p className="text-gray-700">
        <strong>Doctor Identity:</strong> {doctor.doctorIdentity}
      </p>
      <p className="text-gray-700">
        <strong>Specializations:</strong> {specializationNames.length > 0 ? specializationNames.join(', ') : "None"}
      </p>
      <p className="text-gray-700">
        <strong>Is General Practitioner:</strong> {doctor.isGP ? "Yes" : "No"}
      </p>
      <div className="mt-4 space-x-2">
        <button
          onClick={onView}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Doctor;
