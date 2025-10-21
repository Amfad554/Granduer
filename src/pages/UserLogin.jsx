import { useState } from "react";
import { FiMail, FiLock, FiUser, FiPhone } from "react-icons/fi";

import Layout from "../shared/Layout";
import Input from "../shared/Input";

const UserLoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    confirmPassword: "",
    rememberMe: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetInputs = () => {
    setInputs({
      email: "",
      password: "",
      fullName: "",
      phone: "",
      confirmPassword: "",
      rememberMe: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", inputs);
    resetInputs();
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!inputs.email.trim()) {
      alert("Please enter your email to reset password.");
      return;
    }
    alert(`A password reset link has been sent to ${inputs.email}`);
    resetInputs();
    setIsReset(false);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-primary px-4">
        <div className="relative bg-white w-full max-w-md rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
          {!isReset && (
            <div className="flex">
              <button
                onClick={() => {
                  setIsLogin(true);
                  resetInputs();
                }}
                className={`w-1/2 py-3 font-semibold transition-all ${
                  isLogin
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  resetInputs();
                }}
                className={`w-1/2 py-3 font-semibold transition-all ${
                  !isLogin
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* LOGIN */}
          {isLogin && !isReset && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
                Welcome Back
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="email"
                  labelFor="Email"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  placehold="Enter your email"
                />
                <Input
                  type="password"
                  labelFor="Password"
                  name="password"
                  value={inputs.password}
                  onChange={handleInputChange}
                  placehold="Enter your password"
                />
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={inputs.rememberMe}
                      onChange={handleInputChange}
                      className="accent-black w-4 h-4"
                    />
                    Remember me
                  </label>
                </div>
                <button
                  type="submit"
                  className="bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Login
                </button>
              </form>
                <span
                    onClick={() => setIsReset(true)}
                    className="hover:underline cursor-pointer font-medium flex justify-center items-center mt-3"
                  >
                    Forgot Password?
                  </span>
            </div>
          )}

          {/* SIGNUP */}
          {!isLogin && !isReset && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
                Create Account
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  type="text"
                  labelFor="Full Name"
                  name="fullName"
                  value={inputs.fullName}
                  onChange={handleInputChange}
                  placehold="Full Name"
                />
                <Input
                  type="text"
                  labelFor="Phone Number"
                  name="phone"
                  value={inputs.phone}
                  onChange={handleInputChange}
                  placehold="Phone Number"
                />
                <Input
                  type="email"
                  labelFor="Email"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  placehold="Email"
                />
                <Input
                  type="password"
                  labelFor="Password"
                  name="password"
                  value={inputs.password}
                  onChange={handleInputChange}
                  placehold="Password"
                />
                <Input
                  type="password"
                  labelFor="Confirm Password"
                  name="confirmPassword"
                  value={inputs.confirmPassword}
                  onChange={handleInputChange}
                  placehold="Confirm Password"
                />
                <button
                  type="submit"
                  className="bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Sign Up
                </button>
              </form>
            </div>
          )}

          {/* FORGOT PASSWORD */}
          {isReset && (
            <div className="p-8">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
                Reset Password
              </h2>
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <Input
                  type="email"
                  labelFor="Email"
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  placehold="Enter your email"
                />
                <button
                  type="submit"
                  className="bg-black text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition"
                >
                  Send Reset Link
                </button>
                <p
                  onClick={() => setIsReset(false)}
                  className="text-center text-sm text-gray-600 hover:underline cursor-pointer"
                >
                  Back to Login
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserLoginPage;
