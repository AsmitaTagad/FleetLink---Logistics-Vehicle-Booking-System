import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import {
  clearMessage,
  
  loginUser,
  signupUser,
} from "../redux/slicer/authSlicer";
import { setIsAuth } from "../redux/slicer/globalModelSlicer";

const AuthModal = ({ onClose }) => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const { loading, error, message, token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let result;

      if (mode === "login") {
        result = await dispatch(loginUser({ email, password }));
      }
      if (mode === "signup") {
        result = await dispatch(signupUser({ name, email, password }));
      }
      if (mode === "forgot") {
        // result = await dispatch(forgotPassword({ email }));
      }

      if (result?.type?.endsWith("/fulfilled")) {
        if (mode === "login") {
          dispatch(setIsAuth(false));
        } else if (mode === "signup") {
          toast.error("Register SuccessFully !");
          setMode("login");
        }
      } else if (result?.payload) {
        toast.error(result.payload);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (token) {
      toast.success("Login successful!");
      onClose();
    }
  }, [token, onClose]);

  useEffect(() => {
    if (message) toast.success(message);
    if (error) toast.error(error);

    return () => {
      dispatch(clearMessage());
    };
  }, [message, error, dispatch]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login"
            ? "Login"
            : mode === "signup"
            ? "Sign Up"
            : "Forgot Password"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {mode !== "forgot" && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading
              ? "Processing..."
              : mode === "login"
              ? "Login"
              : mode === "signup"
              ? "Sign Up"
              : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-2 text-sm text-center text-gray-600">
          {mode === "login" && (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600"
              >
                Sign Up
              </button>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
