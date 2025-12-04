import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import PulseLoader from "react-spinners/PulseLoader";

import {
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUser,
  FaTools,
} from "react-icons/fa";
import Layout from "../Shared/Layout/Layout";
import { ProductContext } from "../Context/ProductContext";
import { toast } from "react-toastify";
import { loginUser, regUser } from "../services/userService";

const UserLoginPage = () => {
  const {
    HandleLogin,
    isAuthenticated,
    cartItems,
    setCartItems,
    setIsAuthentified,
    setToken,
  } = useContext(ProductContext);
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("log", isLogin);
  }, [isLogin]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preview, setPreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
    confirmpassword: "",
    rememberMe: false,
    image: null,
  });
  const [logData, setLogData] = useState({
    email: "",
    password: "",
  });

  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files?.[0] : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));

    // Update image preview
    if (type === "file" && files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setLogData((prev) => ({ ...prev, [name]: value }));
  };

  // const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  // const validatePhone = (phone) => /^[0-9]{10,15}$/.test(phone);

  const validateForm = () => {
    // const newErrors = {};
    // if (!inputs.email.trim()) newErrors.email = "Email is required";
    // else if (!validateEmail(inputs.email))
    //   newErrors.email = "Invalid email format";
    // if (!isReset) {
    //   if (!inputs.password) newErrors.password = "Password is required";
    //   else if (inputs.password.length < 6)
    //     newErrors.password = "Password must be at least 6 characters";
    //   // Add backend password validation
    //   else if (!/^[A-Z](?=.*[\W_])/.test(inputs.password))
    //     newErrors.password =
    //       "Password must start with uppercase and include a special character";
    // }
    // if (!isLogin && !isReset && isRegister) {
    //   if (!inputs.firstname.trim())
    //     newErrors.firstname = "First name is required";
    //   if (!inputs.lastname.trim()) newErrors.lastname = "Last name is required";
    //   if (!inputs.phone.trim()) newErrors.phone = "Phone number is required";
    //   else if (!validatePhone(inputs.phone))
    //     newErrors.phone = "Invalid phone number";
    //   if (!inputs.address.trim()) newErrors.address = "Address is required";
    //   if (!inputs.confirmpassword)
    //     newErrors.confirmpassword = "Please confirm your password";
    //   else if (inputs.password !== inputs.confirmpassword)
    //     newErrors.confirmpassword = "Passwords do not match";
    // }
    // setErrors(newErrors);
    // return Object.keys(newErrors).length === 0;
  };

  const resetInputs = () => {
    setInputs({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      phone: "",
      address: "",
      confirmpassword: "",
      rememberMe: false,
      image: null,
    });
    setPreview(null);
    setErrors({});
  };

  // const handleSubmit = async (e) => {

  //   console.log("logg");

  //   e.preventDefault();

  //   try {
  //     if (!isLogin && !isReset) {
  //       const formData = new FormData();
  //       formData.append("firstname", inputs.firstname);
  //       formData.append("lastname", inputs.lastname);
  //       formData.append("email", inputs.email);
  //       formData.append("phone", inputs.phone);
  //       formData.append("address", inputs.address);
  //       formData.append("password", inputs.password);
  //       formData.append("confirmpassword", inputs.confirmpassword);

  //       if (inputs.image) {
  //         formData.append("image", inputs.image);
  //       }

  //       const res = await regUser(formData);

  //       if (res.ok) {
  //         toast.success(res.data?.message || "Registration successful!");
  //         resetInputs();
  //         setIsLogin(true);
  //       } else {
  //         toast.error(res.data?.message || res.error || "Registration failed!");
  //       }
  //     }
  //     if (isLogin === true) {
  //       //Login Logic

  //       console.log("body", logData);

  //       const res = await loginUser(logData, cartItems);
  //       if (res.ok) {
  //         toast.success(res?.data?.message);
  //         setCartItems([]);
  //         localStorage.setItem("token", res.token);
  //         localStorage.removeItem("cartItems");
  //       } else {
  //         toast.error(res?.data?.message || res.error);
  //       }
  //     }
  //   } catch (error) {
  //     toast.error(error, "Something went wrong!");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // <-- start spinner

    try {
      if (!isLogin && !isReset) {
        const formData = new FormData();
        formData.append("firstname", inputs.firstname);
        formData.append("lastname", inputs.lastname);
        formData.append("email", inputs.email);
        formData.append("phone", inputs.phone);
        formData.append("address", inputs.address);
        formData.append("password", inputs.password);
        formData.append("confirmpassword", inputs.confirmpassword);

        if (inputs.image) {
          formData.append("image", inputs.image);
        }

        const res = await regUser(formData);

        if (res.ok) {
          toast.success(res.data?.message || "Registration successful!");
          resetInputs();
          setIsLogin(true);
        } else {
          toast.error(res.data?.message || res.error || "Registration failed!");
        }
      }

      if (isLogin) {
        console.log("body", logData);
        const res = await loginUser(logData, cartItems);

        if (res.ok) {
          toast.success(res?.data?.message);
          setCartItems([]);
          localStorage.setItem("isAuthentified", "true");
          setIsAuthentified(true);
          setToken(res.token);
          localStorage.setItem("token", res.token);
          if (res.decoded) {
            localStorage.setItem("user", JSON.stringify(res.decoded));
          }

          localStorage.removeItem("cartItems");
          navigate("/")
        } else {
          toast.error(res?.data?.message || res.error);
        }
      }
    } catch (error) {
      toast.error(error, "Something went wrong!");
    } finally {
      setLoading(false); // <-- stop spinner
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    toast.success("Reset link sent!");
    resetInputs();
    setIsReset(false);
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        {loading && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-white bg-opacity-75">
            <div className="flex flex-col items-center">
              <PulseLoader size={12} color="#000" />
              <p className="text-black mt-2 font-semibold">Logging in...</p>
            </div>
          </div>
        )}

        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          {!isReset && (
            <div className="flex">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setIsReset(false);

                  resetInputs();
                }}
                className={`w-1/2 py-4 font-semibold transition-all ${
                  isLogin
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  resetInputs();
                }}
                className={`w-1/2 py-4 font-semibold transition-all ${
                  !isLogin
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          {/* Login Form */}
          {isLogin && !isReset && (
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
              <div className="flex justify-center mb-6">
                <div className="bg-black text-white p-4 rounded-full">
                  <FaSignInAlt size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">
                Welcome Back
              </h2>
              <p className="text-center text-gray-600 mb-6">
                Sign in to your account
              </p>

              <input
                type="email"
                name="email"
                value={logData.email}
                onChange={handleLogChange}
                placeholder="Enter your email"
                className={`w-full p-3 rounded-lg border-2 `}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={logData.password}
                  onChange={handleLogChange}
                  placeholder="Enter your password"
                  className={`w-full p-3 pr-10 rounded-lg border-2 `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={inputs.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsReset(true)}
                  className="text-black font-medium hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {!isLogin && !isReset && (
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
              <div className="flex justify-center mb-6">
                <div className="bg-black text-white p-4 rounded-full">
                  <FaUser size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">
                Create Account
              </h2>

              <input
                type="text"
                name="firstname"
                value={inputs.firstname}
                onChange={handleInputChange}
                placeholder="First Name"
                className={`w-full p-3 rounded-lg border-2 ${
                  errors.firstname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstname && (
                <span className="text-red-500 text-sm">{errors.firstname}</span>
              )}

              <input
                type="text"
                name="lastname"
                value={inputs.lastname}
                onChange={handleInputChange}
                placeholder="Last Name"
                className={`w-full p-3 rounded-lg border-2 ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastname && (
                <span className="text-red-500 text-sm">{errors.lastname}</span>
              )}

              <input
                type="tel"
                name="phone"
                value={inputs.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className={`w-full p-3 rounded-lg border-2 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">{errors.phone}</span>
              )}

              <input
                type="email"
                name="email"
                value={inputs.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`w-full p-3 rounded-lg border-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}

              <input
                type="text"
                name="address"
                value={inputs.address}
                onChange={handleInputChange}
                placeholder="Address"
                className={`w-full p-3 rounded-lg border-2 ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && (
                <span className="text-red-500 text-sm">{errors.address}</span>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={inputs.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`w-full p-3 rounded-lg border-2 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">{errors.password}</span>
              )}

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmpassword"
                  value={inputs.confirmpassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={`w-full p-3 rounded-lg border-2 ${
                    errors.confirmpassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmpassword && (
                <span className="text-red-500 text-sm">
                  {errors.confirmpassword}
                </span>
              )}

              <div>
                <label className="text-sm font-semibold mb-2 block">
                  Profile Image (Optional)
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-300"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <button
                type="submit"
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
              >
                Create Account
              </button>
            </form>
          )}

          {/* Reset Password Form */}
          {isReset && (
            <form
              onSubmit={handleResetPassword}
              className="p-8 flex flex-col gap-4"
            >
              <div className="flex justify-center mb-6">
                <div className="bg-black text-white p-4 rounded-full">
                  <FaTools size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">
                Reset Password
              </h2>
              <input
                type="email"
                name="email"
                value={inputs.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg border-2 border-gray-300"
              />

              <button
                type="submit"
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
              >
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReset(false);
                  resetInputs();
                }}
                className="text-center text-sm text-gray-600 hover:underline"
              >
                Back to Login
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserLoginPage;
