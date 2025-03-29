const Diagnosis = ({ diagnosis, onEdit, onDelete }) => (
  <div className="border p-4 rounded-lg mb-4">
    <h2 className="font-bold">{diagnosis.diagnosis}</h2>
    <p>{diagnosis.description}</p>
    <div className="mt-2">
      <button
        onClick={() => onEdit(diagnosis.id)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-green-600"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(diagnosis.id)}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  </div>
);

export default Diagnosis;
