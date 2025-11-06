import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // for hamburger icons

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/");
    }, 500);
    return () => clearTimeout(delay);
  }, [search, navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-indigo-400 hover:text-indigo-300"
        >
          📝 Note It!
        </Link>

        {/* Hamburger menu button (visible only on mobile) */}
        {user && (
          <button
            className="sm:hidden block focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        )}

        {/* Desktop Menu */}
        {user && (
          <div className="hidden sm:flex items-center space-x-4">
            <div className="w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="🔍 Search Notes..."
                className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white 
                placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:border-indigo-500 transition duration-200"
              />
            </div>
            <span className="text-gray-300 font-medium">{user.userName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition duration-200"
            >
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <div className="sm:hidden bg-gray-800 px-4 pb-4 space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search Notes..."
            className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-900 text-white 
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 
            focus:border-indigo-500 transition duration-200"
          />

          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">{user.userName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
