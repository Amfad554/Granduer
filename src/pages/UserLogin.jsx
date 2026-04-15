import { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { FaEye, FaEyeSlash, FaSignInAlt, FaUser, FaTools } from "react-icons/fa";
import Layout from "../Shared/Layout/Layout";
import { ProductContext } from "../Context/ProductContext";
import { toast } from "react-toastify";
import { loginUser, regUser } from "../services/userService";

const UserLoginPage = () => {
  const {
    isAuthentified,
    cartItems,
    setCartItems,
    handleLoginSuccess,
    User,
  } = useContext(ProductContext);

  const navigate = useNavigate();
  const location = useLocation();

  // ─── Read state passed from navigate() ────────────────────────────────────
  const redirectMessage = location.state?.message;         // deleted account message
  const defaultTab = location.state?.defaultTab;           // "register" from cart checkout

  const [isLogin, setIsLogin] = useState(defaultTab !== "register"); // open register tab if requested
  const [isReset, setIsReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const [inputs, setInputs] = useState({
    email: "", password: "", firstname: "", lastname: "",
    phone: "", address: "", confirmpassword: "", rememberMe: false, image: null,
  });

  const [logData, setLogData] = useState({ email: "", password: "" });

  // ─── Redirect if already logged in — role-based ───────────────────────────
  useEffect(() => {
    if (isAuthentified && User?.role) {
      if (User.role === "admin") {
        navigate("/AdminDash");
      } else {
        navigate("/userDash");
      }
    }
  }, [isAuthentified, User, navigate]);

  // ─── Input handlers ───────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const resetInputs = () => {
    setInputs({
      email: "", password: "", firstname: "", lastname: "",
      phone: "", address: "", confirmpassword: "", rememberMe: false, image: null,
    });
    setPreview(null);
    setErrors({});
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        if (inputs.image) formData.append("image", inputs.image);

        const res = await regUser(formData);
        if (res.ok) {
          toast.success(res.data?.message || "Registration successful!");
          resetInputs();
          setIsLogin(true);
        } else {
          toast.error(res.data?.message || res.error || "Registration failed!");
        }
      }

      if (isLogin && !isReset) {
        const res = await loginUser(logData, cartItems);
        if (res.ok) {
          toast.success(res?.data?.message);
          handleLoginSuccess(res.decoded, res.token);
          setCartItems([]);
          localStorage.removeItem("cartItems");

          if (res.decoded?.role === "admin") {
            navigate("/AdminDash");
          } else {
            navigate("/userDash");
          }
        } else {
          toast.error(res?.data?.message || res.error);
        }
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
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
              <p className="text-black mt-2 font-semibold">
                {isLogin ? "Logging in..." : "Creating account..."}
              </p>
            </div>
          </div>
        )}

        <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

          {/* ── Redirect message banner (deleted account or checkout gate) ── */}
          {redirectMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 text-sm px-4 py-3">
              ⚠️ {redirectMessage}
            </div>
          )}

          {!isReset && (
            <div className="flex">
              <button
                onClick={() => { setIsLogin(true); setIsReset(false); resetInputs(); }}
                className={`w-1/2 py-4 font-semibold transition-all ${isLogin ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Login
              </button>
              <button
                onClick={() => { setIsLogin(false); resetInputs(); }}
                className={`w-1/2 py-4 font-semibold transition-all ${!isLogin ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Sign Up
              </button>
            </div>
          )}

          {isLogin && !isReset && (
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
              <div className="flex justify-center mb-6">
                <div className="bg-black text-white p-4 rounded-full">
                  <FaSignInAlt size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
              <p className="text-center text-gray-600 mb-6">Sign in to your account</p>

              <input type="email" name="email" value={logData.email} onChange={handleLogChange}
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-black outline-none" required />

              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={logData.password}
                  onChange={handleLogChange} placeholder="Enter your password"
                  className="w-full p-3 pr-10 rounded-lg border-2 border-gray-300 focus:border-black outline-none" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="rememberMe" checked={inputs.rememberMe}
                    onChange={handleInputChange} className="w-4 h-4 accent-black" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <button type="button" onClick={() => setIsReset(true)}
                  className="text-black font-medium hover:underline">
                  Forgot Password?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">
                Sign In
              </button>
            </form>
          )}

          {!isLogin && !isReset && (
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4">
              <div className="flex justify-center mb-6">
                <div className="bg-black text-white p-4 rounded-full">
                  <FaUser size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">Create Account</h2>

              <input type="text" name="firstname" value={inputs.firstname} onChange={handleInputChange}
                placeholder="First Name" className={`w-full p-3 rounded-lg border-2 ${errors.firstname ? "border-red-500" : "border-gray-300"}`} />
              {errors.firstname && <span className="text-red-500 text-sm">{errors.firstname}</span>}

              <input type="text" name="lastname" value={inputs.lastname} onChange={handleInputChange}
                placeholder="Last Name" className={`w-full p-3 rounded-lg border-2 ${errors.lastname ? "border-red-500" : "border-gray-300"}`} />
              {errors.lastname && <span className="text-red-500 text-sm">{errors.lastname}</span>}

              <input type="tel" name="phone" value={inputs.phone} onChange={handleInputChange}
                placeholder="Phone Number" className={`w-full p-3 rounded-lg border-2 ${errors.phone ? "border-red-500" : "border-gray-300"}`} />
              {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}

              <input type="email" name="email" value={inputs.email} onChange={handleInputChange}
                placeholder="Email Address" className={`w-full p-3 rounded-lg border-2 ${errors.email ? "border-red-500" : "border-gray-300"}`} />
              {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}

              <input type="text" name="address" value={inputs.address} onChange={handleInputChange}
                placeholder="Address" className={`w-full p-3 rounded-lg border-2 ${errors.address ? "border-red-500" : "border-gray-300"}`} />
              {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}

              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={inputs.password}
                  onChange={handleInputChange} placeholder="Password"
                  className={`w-full p-3 rounded-lg border-2 ${errors.password ? "border-red-500" : "border-gray-300"}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}

              <div className="relative">
                <input type={showConfirmPassword ? "text" : "password"} name="confirmpassword"
                  value={inputs.confirmpassword} onChange={handleInputChange} placeholder="Confirm Password"
                  className={`w-full p-3 rounded-lg border-2 ${errors.confirmpassword ? "border-red-500" : "border-gray-300"}`} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmpassword && <span className="text-red-500 text-sm">{errors.confirmpassword}</span>}

              <div>
                <label className="text-sm font-semibold mb-2 block">Profile Image (Optional)</label>
                <input type="file" name="image" accept="image/*" onChange={handleInputChange}
                  className="w-full p-3 rounded-lg border-2 border-gray-300" />
                {preview && <img src={preview} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />}
              </div>

              <button type="submit" disabled={loading}
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50">
                Create Account
              </button>
            </form>
          )}

          {isReset && (
            <form onSubmit={handleResetPassword} className="p-8 flex flex-col gap-4">
              <div className="flex justify-center mb-6">
                <div className="bg-black text-white p-4 rounded-full">
                  <FaTools size={32} />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-center mb-2">Reset Password</h2>
              <p className="text-center text-gray-500 text-sm mb-2">
                Enter your email and we'll send you a reset link.
              </p>

              <input type="email" name="email" value={inputs.email} onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-black outline-none" required />

              <button type="submit"
                className="bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800">
                Send Reset Link
              </button>
              <button type="button" onClick={() => { setIsReset(false); resetInputs(); }}
                className="text-center text-sm text-gray-600 hover:underline">
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