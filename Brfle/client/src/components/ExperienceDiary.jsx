import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  BookOpen, 
  Calendar, 
  Save, 
  CheckCircle, 
  ArrowLeft,
  Edit,
  Trash2,
  Plus
} from "lucide-react";

export default function ExperienceDiary() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.auth);
  const { enrollments } = useSelector((state) => state.enrollments);
  
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split('T')[0],
    tags: []
  });
  const [editingId, setEditingId] = useState(null);
  const [newTag, setNewTag] = useState("");

  // Get current course enrollment
  const currentEnrollment = enrollments.find(e => e.course?._id === courseId);

  useEffect(() => {
    // Load saved entries from localStorage (or from API in real implementation)
    const savedEntries = localStorage.getItem(`diary_${courseId}_${user?._id}`);
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, [courseId, user]);

  const handleSaveEntry = () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    let updatedEntries;
    
    if (editingId) {
      // Update existing entry
      updatedEntries = entries.map(entry =>
        entry.id === editingId 
          ? { ...currentEntry, id: editingId, updatedAt: new Date().toISOString() }
          : entry
      );
    } else {
      // Create new entry
      const newEntry = {
        ...currentEntry,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedEntries = [newEntry, ...entries];
    }

    setEntries(updatedEntries);
    localStorage.setItem(`diary_${courseId}_${user?._id}`, JSON.stringify(updatedEntries));
    
    // Mark diary as completed if user has at least 3 entries
    if (updatedEntries.length >= 3 && currentEnrollment) {
      markDiaryAsCompleted();
    }

    resetForm();
  };

  const markDiaryAsCompleted = () => {
    // In a real app, this would dispatch an action to update progress
    const progressDetails = JSON.parse(localStorage.getItem('userProgress') || '{}');
    progressDetails[courseId] = {
      ...progressDetails[courseId],
      diaryCompleted: true
    };
    localStorage.setItem('userProgress', JSON.stringify(progressDetails));
  };

  const handleEditEntry = (entry) => {
    setCurrentEntry({
      title: entry.title,
      content: entry.content,
      date: entry.date,
      tags: [...entry.tags]
    });
    setEditingId(entry.id);
  };

  const handleDeleteEntry = (entryId) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      const updatedEntries = entries.filter(entry => entry.id !== entryId);
      setEntries(updatedEntries);
      localStorage.setItem(`diary_${courseId}_${user?._id}`, JSON.stringify(updatedEntries));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !currentEntry.tags.includes(newTag.trim())) {
      setCurrentEntry(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setCurrentEntry(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const resetForm = () => {
    setCurrentEntry({
      title: "",
      content: "",
      date: new Date().toISOString().split('T')[0],
      tags: []
    });
    setEditingId(null);
    setNewTag("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isDiaryCompleted = entries.length >= 3;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Course
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Learning Experience Diary
              </h1>
              <p className="text-gray-600">
                Document your learning journey, insights, and reflections
              </p>
            </div>
            
            {isDiaryCompleted && (
              <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <CheckCircle size={20} />
                <span className="font-semibold">20/20 Points Earned</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Entry Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {editingId ? 'Edit Entry' : 'New Entry'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="What did you learn today?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={currentEntry.date}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                    placeholder="Describe your learning experience, challenges, insights, and how you applied what you learned..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Add a tag"
                    />
                    <button
                      onClick={addTag}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {currentEntry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-blue-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveEntry}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    {editingId ? 'Update Entry' : 'Save Entry'}
                  </button>
                  
                  {editingId && (
                    <button
                      onClick={resetForm}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Progress</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Entries Created</span>
                  <span className="font-semibold">{entries.length}/3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((entries.length / 3) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Create at least 3 entries to earn 20 points
                </p>
              </div>
            </div>
          </div>

          {/* Entries List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Your Diary Entries ({entries.length})
                </h2>
              </div>

              <div className="p-6">
                {entries.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No entries yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start documenting your learning journey by creating your first entry.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {entry.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(entry.date)}
                              </span>
                              {entry.updatedAt !== entry.createdAt && (
                                <span className="text-xs text-gray-500">
                                  Edited {formatDate(entry.updatedAt)}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditEntry(entry)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteEntry(entry.id)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <p className="text-gray-700 whitespace-pre-wrap mb-4">
                          {entry.content}
                        </p>

                        {entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {entry.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}