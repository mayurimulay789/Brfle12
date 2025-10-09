import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CourseUploadForm = ({ onCancel, course, onUpdate }) => {
  const { token } = useSelector((state) => state.auth);
  const [courseName, setCourseName] = useState(course?.courseName || '');
  const [category, setCategory] = useState(course?.category || '');
  const [level, setLevel] = useState(course?.level || 'Beginner');
  const [price, setPrice] = useState(course?.price || '');
  const [thumbnail, setThumbnail] = useState(null);
  const [lessons, setLessons] = useState(course?.lessons || [{ name: '', url: '', description: '' }]);

  const addLesson = () => {
    setLessons([...lessons, { name: '', url: '', description: '' }]);
  };

  const updateLesson = (index, field, value) => {
    const updatedLessons = lessons.map((lesson, i) =>
      i === index ? { ...lesson, [field]: value } : lesson
    );
    setLessons(updatedLessons);
  };

  const removeLesson = (index) => {
    if (lessons.length > 1) {
      setLessons(lessons.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('courseName', courseName);
    formData.append('category', category);
    formData.append('level', level);
    formData.append('price', price);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    formData.append('lessons', JSON.stringify(lessons));

    try {
      let response;
      if (course?._id) {
        // Update existing course
        response = await fetch(`/api/admin/courses/${course._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        // Create new course
        response = await fetch('/api/admin/courses', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      if (response.ok) {
        alert(course?._id ? 'Course updated successfully' : 'Course uploaded successfully');
        setCourseName('');
        setLevel('Beginner');
        setPrice('');
        setThumbnail(null);
        setLessons([{ name: '', url: '', description: '' }]);
        if (course?._id && onUpdate) {
          onUpdate();
        } else {
          onCancel();
        }
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
  <h2 className="text-xl font-bold mb-4">{course?._id ? 'Update Course' : 'Upload Course'}</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Course Name</label>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select a category</option>
          <option value="Programming">Programming</option>
          <option value="Design">Design</option>
          <option value="Business">Business</option>
          <option value="Marketing">Marketing</option>
          <option value="Language">Language</option>
          <option value="Personal Development">Personal Development</option>
          <option value="Technology">Technology</option>
          <option value="Finance">Finance</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Price (in Indian Rs)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Thumbnail</label>
        {course?.thumbnail && (
          <div className="mb-2">
            <span className="block text-xs text-gray-500 mb-1">Current Thumbnail:</span>
            {(() => {
              const ext = course.thumbnail.split('.').pop().toLowerCase();
              const url = course.thumbnail.startsWith('http')
                ? course.thumbnail
                : `http://localhost:5000/uploads/${course.thumbnail}`;
              if (["mp4","webm","ogg"].includes(ext)) {
                return (
                  <video src={url} className="w-20 h-20 rounded-lg object-cover mb-2" controls />
                );
              } else {
                return (
                  <img src={url} alt="Current Thumbnail" className="w-20 h-20 rounded-lg object-cover mb-2" />
                );
              }
            })()}
          </div>
        )}
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="w-full"
        />
        {course?._id && (
          <span className="block text-xs text-gray-500 mt-1">Leave empty to keep current thumbnail.</span>
        )}
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Lessons</h3>
        {lessons.map((lesson, index) => (
          <div key={index} className="mb-4 p-4 border border-gray-200 rounded">
            <div className="mb-2">
              <label className="block mb-1 font-medium">Lesson Name</label>
              <input
                type="text"
                value={lesson.name}
                onChange={(e) => updateLesson(index, 'name', e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium">Lesson URL</label>
              <input
                type="url"
                value={lesson.url}
                onChange={(e) => updateLesson(index, 'url', e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                value={lesson.description}
                onChange={(e) => updateLesson(index, 'description', e.target.value)}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows={3}
              />
            </div>
            {lessons.length > 1 && (
              <button
                type="button"
                onClick={() => removeLesson(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove Lesson
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addLesson}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <span className="mr-2">+</span> Add More Lessons
        </button>
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
