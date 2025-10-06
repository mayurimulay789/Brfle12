import React, { useState } from 'react';

const CourseUploadForm = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just alert the form data
    alert(`Course Title: ${title}\nDescription: ${description}\nFile: ${file ? file.name : 'No file selected'}`);
    // Reset form
    setTitle('');
    setDescription('');
    setFile(null);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Upload Course</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Course Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
          rows={4}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Course File</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
          className="w-full"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </div>
    </form>
  );
};

export default CourseUploadForm;
