import React, { useEffect, useState } from "react";
import axios from "axios";
import NoteModal from "../component/NoteModal";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();


  // Fetch all notes
  const getNotes = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    const searchParams = new URLSearchParams(location.search);
    const search = searchParams.get("search") || "";

    const { data } = await axios.get("/api/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const filteredNotes = search
      ? data.filter(
          (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase())
        )
      : data;

    setNotes(filteredNotes);
    setError("");
  } catch (err) {
    console.error("Error fetching notes:", err);
    setError(err.response?.data?.message || "Failed to fetch notes");
  }
};


  useEffect(() => {
    getNotes();
  },[location.search]);

  // Handle save 
  const handleSaveNote = (newNote) => {
    if (editNote) {
      // Update existing note
      setNotes((prevNotes) =>
        prevNotes.map((item) =>
          item._id === newNote._id ? newNote : item
        )
      );
    } else {
      // Add new note
      setNotes((prevNotes) => [...prevNotes, newNote]);
    }

    // Close modal after saving
    setIsModalOpen(false);
    setEditNote(null);
  };

  // Handle edit
  const handleEdit = (note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prevNotes) => prevNotes.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting note:", err);
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-slate-800 to-gray-900 text-white py-12 px-6">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-white tracking-tight drop-shadow-md">
        📝 My Notes Dashboard
      </h1>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 text-red-400 border border-red-400/40 p-4 rounded-lg mb-8 text-center shadow-sm backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Note Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />

      {/* Floating Add Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        title="Add Note"
        className="fixed bottom-8 right-8 h-16 w-16 bg-linear-to-br from-purple-600 to-indigo-600 text-white text-4xl rounded-full shadow-lg hover:scale-110 hover:shadow-2xl active:scale-95 transition-all duration-300 flex items-center justify-center"
      >
        +
      </button>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <p className="text-center text-gray-400 text-lg italic mt-24">
          No notes found. Start adding some!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {notes.map((item) => (
            <div
              key={item._id}
              className="bg-slate-800/80 border border-slate-700 p-6 rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.03] transition-all duration-300 backdrop-blur-sm"
            >
              <h3 className="text-2xl font-bold text-white mb-3 truncate">
                {item.title}
              </h3>
              <p className="text-gray-300 mb-4 line-clamp-3">
                {item.description}
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Updated: {new Date(item.updatedAt).toLocaleString()}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => deleteNote(item._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-all duration-200"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
