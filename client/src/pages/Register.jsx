import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignIn from "../components/GoogleSignIn";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Register</h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-lg focus:outline-none focus:border-black dark:focus:border-white transition-colors"
            required
          />
          {error && (
            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-medium hover:opacity-80 transition-opacity"
          >
            Register
          </button>
        </form>
        
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          <span className="px-4 text-sm text-gray-600 dark:text-gray-400">OR</span>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
        </div>

        <GoogleSignIn />

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium hover:opacity-80 transition-opacity">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
