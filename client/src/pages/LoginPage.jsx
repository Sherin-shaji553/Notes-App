import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

const Login = ({setUser}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
        const {data} = await axios.post('/api/users/login',{
            email, password
        }) 
        localStorage.setItem("token", data.token)
        setUser(data)
        navigate('/')
    }catch(error){
        setError(error.response?.data?.message || "Server Error" )
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-600 mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 bg-red-50 py-2 rounded-md">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-700 focus:border-transparent outline-none transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-black-600">
          Don’t have an account?{" "}
          <Link
            className="text-red-600 font-medium hover:underline"
            to="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
