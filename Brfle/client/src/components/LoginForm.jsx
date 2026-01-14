import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError, clearSuccess } from "../store/slices/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localMessage, setLocalMessage] = useState("");

  const { email, password } = formData;

  // -------------------- handlers --------------------
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // -------------------- effects --------------------
  // useEffect(() => {
  //   // clear old messages when component loads
    
  //   setTimeout(dispatch(clearError()),2000);
  //   dispatch(clearSuccess());
  // }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // -------------------- submit --------------------
  const onSubmit = (e) => {
    e.preventDefault();

    setLocalMessage("");

    // ❌ DO NOT clear redux error here (this was the bug)

    if (!validateEmail(email)) {
      setLocalMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setLocalMessage("Password must be at least 6 characters");
      return;
    }

    dispatch(loginUser({ email, password }));
  };

  // -------------------- message handling --------------------
  let displayMessage = null;
  let messageType = "";

  if (localMessage) {
    displayMessage = localMessage;
    messageType = "error";
  } else if (error) {
    displayMessage = error;
    messageType = "error";
  } else if (success) {
    displayMessage = success;
    messageType = "success";
  }

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="max-w-4xl w-full min-h-[450px] bg-white shadow-lg rounded-lg overflow-hidden flex">
        
        {/* Left Image */}
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/two.jpg')" }}
        >
          <div className="h-full w-full flex flex-col items-center justify-center bg-black bg-opacity-40">
            <h2 className="text-white text-3xl font-bold text-center">
              Welcome Back
            </h2>
            <p className="text-white text-sm mt-2 text-center px-6">
              Please log in using your personal information to stay connected
            </p>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
          <p className="text-center text-gray-500 mb-6">
            Please log in using your personal information
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-amber-400 pr-10"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded font-semibold transition disabled:bg-amber-300 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Message */}
          {displayMessage && (
            <p
              className={`mt-4 text-center font-medium ${
                messageType === "error"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {displayMessage}
            </p>
          )}

          {/* Register */}
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => !loading && navigate("/register")}
              className={`text-amber-500 font-semibold cursor-pointer hover:underline ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
